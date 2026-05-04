package za.ac.youthVend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Integer userId;
    private String username;
    private String email;
    private String role; // from UserRole
    private LocalDateTime createdAt;
    private String phone;
}
