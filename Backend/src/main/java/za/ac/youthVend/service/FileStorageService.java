package za.ac.youthVend.service;

import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import javax.imageio.IIOImage;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final Path thumbnailStorageLocation;
    private static final int THUMBNAIL_MAX_WIDTH = 400;
    private static final int THUMBNAIL_MAX_HEIGHT = 400;
    private static final float JPEG_QUALITY = 0.85f;

    public FileStorageService(
            @Value("${file.upload-dir:uploads/products}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
        this.thumbnailStorageLocation = Paths.get(uploadDir, "thumbnails")
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
            Files.createDirectories(this.thumbnailStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory!", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Get original filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if file contains invalid characters
            if (originalFilename.contains("..")) {
                throw new RuntimeException("Invalid file path: " + originalFilename);
            }

            // Generate unique filename
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to target location and optimize
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            
            // Optimize image if it's an image file
            if (isImageFile(fileExtension)) {
                optimizeAndSaveImage(file, targetLocation, fileExtension);
            } else {
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            // Generate thumbnail for images
            if (isImageFile(fileExtension)) {
                generateThumbnail(targetLocation, uniqueFileName, fileExtension);
            }

            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename, ex);
        }
    }

    private boolean isImageFile(String fileExtension) {
        String ext = fileExtension.toLowerCase();
        return ext.equals(".jpg") || ext.equals(".jpeg") || ext.equals(".png") || 
               ext.equals(".gif") || ext.equals(".webp") || ext.equals(".bmp");
    }

    private void optimizeAndSaveImage(MultipartFile file, Path targetLocation, String fileExtension) 
            throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new IOException("Could not read image file");
        }

        String ext = fileExtension.toLowerCase();
        boolean isJpeg = ext.equals(".jpg") || ext.equals(".jpeg");

        // For JPEG, we can control quality; for PNG, just resize if needed
        if (isJpeg) {
            // Write with compression quality
            ImageIO.setUseCache(false);
            javax.imageio.ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
            javax.imageio.stream.ImageOutputStream ios = ImageIO.createImageOutputStream(targetLocation.toFile());
            writer.setOutput(ios);
            
            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(JPEG_QUALITY);
            
            writer.write(null, new IIOImage(originalImage, null, null), param);
            writer.dispose();
            ios.close();
        } else {
            // For PNG and other formats, just save (PNG is already lossless)
            ImageIO.write(originalImage, ext.replace(".", ""), targetLocation.toFile());
        }
    }

    private void generateThumbnail(Path originalPath, String fileName, String fileExtension) 
            throws IOException {
        BufferedImage originalImage = ImageIO.read(originalPath.toFile());
        if (originalImage == null) {
            return;
        }

        // Calculate thumbnail dimensions while maintaining aspect ratio
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        
        // Only create thumbnail if original is larger than thumbnail size
        if (originalWidth <= THUMBNAIL_MAX_WIDTH && originalHeight <= THUMBNAIL_MAX_HEIGHT) {
            return;
        }

        // Resize image for thumbnail
        BufferedImage thumbnail = Scalr.resize(
            originalImage,
            Scalr.Method.AUTOMATIC,
            Scalr.Mode.FIT_TO_HEIGHT,
            THUMBNAIL_MAX_WIDTH,
            THUMBNAIL_MAX_HEIGHT,
            Scalr.OP_ANTIALIAS
        );

        // Save thumbnail
        String thumbnailFileName = "thumb_" + fileName;
        Path thumbnailPath = this.thumbnailStorageLocation.resolve(thumbnailFileName);
        
        String ext = fileExtension.toLowerCase().replace(".", "");
        if (ext.equals("jpg") || ext.equals("jpeg")) {
            ext = "jpg";
        }
        
        ImageIO.write(thumbnail, ext, thumbnailPath.toFile());
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
            
            // Also delete thumbnail if exists
            String thumbnailFileName = "thumb_" + fileName;
            Path thumbnailPath = this.thumbnailStorageLocation.resolve(thumbnailFileName).normalize();
            Files.deleteIfExists(thumbnailPath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName, ex);
        }
    }

    public Path getFilePath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }

    public Path getThumbnailPath(String fileName) {
        return this.thumbnailStorageLocation.resolve("thumb_" + fileName).normalize();
    }

    public boolean thumbnailExists(String fileName) {
        Path thumbnailPath = getThumbnailPath(fileName);
        return Files.exists(thumbnailPath);
    }
}