package za.ac.youthVend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;
import za.ac.youthVend.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // AUTHENTICATION ENDPOINTS
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody java.util.Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        if (userService.emailExists(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(java.util.Map.of("success", false, "message", "Email already registered"));
        }

        User newUser = User.builder()
            .username(name)
            .email(email)
            .password(password)
            .role(UserRole.BUYER)
            .enabled(true)
            .build();

        User created = userService.createUser(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of(
            "success", true,
            "user", java.util.Map.of(
                "name", created.getUsername(),
                "email", created.getEmail()
            )
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userService.getUserByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(java.util.Map.of("success", false, "message", "Invalid email or password"));
        }

        User user = userOpt.get();
        
        return ResponseEntity.ok(java.util.Map.of(
            "success", true,
            "user", java.util.Map.of(
                "name", user.getUsername(),
                "email", user.getEmail()
            )
        ));
    }

    // =========================
    // CREATE USER
    // =========================
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // =========================
    // GET USER BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // =========================
    // GET ALL USERS
    // =========================
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) UserRole role) {

        if (username != null) {
            return new ResponseEntity<>(userService.searchUsersByUsername(username), HttpStatus.OK);
        }

        if (role != null) {
            return new ResponseEntity<>(userService.getUsersByRole(role), HttpStatus.OK);
        }

        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    // =========================
    // UPDATE USER
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        try {
            user.setUserId(id);
            User updatedUser = userService.updateUser(user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // =========================
    // DELETE USER
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // =========================
    // CHECK EMAIL EXISTS
    // =========================
    @GetMapping("/exists")
    public ResponseEntity<Boolean> emailExists(@RequestParam String email) {
        return new ResponseEntity<>(userService.emailExists(email), HttpStatus.OK);
    }
}
