package food.truck.api.client;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import food.truck.api.data.media.Media;
import food.truck.api.data.media.MediaService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_notification.TruckNotificationService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

@Log4j2
@Service
public class AmazonClient {

    @Autowired
    MediaService mediaService;

    @Autowired
    TruckService truckService;

    @Autowired
    UserService userService;

    @Autowired
    TruckNotificationService truckNotificationService;

    private AmazonS3 s3client;

    @Value("${amazonProperties.endpointUrl}")
    private String endpointUrl;
    @Value("${amazonProperties.bucketName}")
    private String bucketName;
    @Value("${amazonProperties.accessKey}")
    private String accessKey;
    @Value("${amazonProperties.secretKey}")
    private String secretKey;

    @PostConstruct
    private void initializeAmazon() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
        this.s3client = new AmazonS3Client(credentials);
    }

    private static File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

    private static String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
    }

    private static String getFileExtension(MultipartFile multipartFile) {
        return multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf('.'));
    }

    private void uploadFileTos3bucket(String fileName, File file) {
        s3client.putObject(new PutObjectRequest(bucketName, fileName, file)
            .withCannedAcl(CannedAccessControlList.PublicRead));
    }

    public String uploadFile(MultipartFile multipartFile) {
        String fileUrl = "";
        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileName = generateFileName(multipartFile);
            fileUrl = endpointUrl + "/" + bucketName + "/" + fileName;
            uploadFileTos3bucket(fileName, file);
            file.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrl;
    }

    public String deleteFileFromS3Bucket(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        s3client.deleteObject(new DeleteObjectRequest(bucketName + "/", fileName));
        return "Successfully deleted";
    }

    public String uploadProfilePicture(MultipartFile multipartFile, Long userID) {
        String fileUrl = "";

        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileName = "profiles/" + userID + getFileExtension(multipartFile);
            fileUrl = endpointUrl + "/" + bucketName + "/" + fileName;
            uploadFileTos3bucket(fileName, file);
            file.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return fileUrl;
    }

    public void deleteProfilePicture(User user) {
        String fileName = user.getAvatar().getUrl().substring(user.getAvatar().getUrl().lastIndexOf('/') + 1);
        s3client.deleteObject(new DeleteObjectRequest(bucketName, "profiles/" + fileName));

        Media avatar = user.getAvatar();
        user.setAvatar(null);
        userService.saveUser(user);
        mediaService.deleteMedia(avatar);
    }

    public String uploadMenu(MultipartFile multipartFile, Truck truck) {
        String fileUrl = "";

        this.deleteMenu(truck);

        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileName = "menus/" + truck.getId() + getFileExtension(multipartFile);
            fileUrl = endpointUrl + "/" + bucketName + "/" + fileName;
            uploadFileTos3bucket(fileName, file);
            file.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return fileUrl;
    }

    public void deleteMenu(Truck truck) {
        if (truck.getMenu() == null) {
            return;
        }

        String fileName = truck.getMenu().getUrl().substring(truck.getMenu().getUrl().lastIndexOf('/') + 1);
        log.info(fileName);
        s3client.deleteObject(new DeleteObjectRequest(bucketName, "menus/" + fileName));

        Media menu = truck.getMenu();
        truck.setMenu(null);
        truckService.saveTruck(truck);
        mediaService.deleteMedia(menu);
    }

    public String uploadNotificationMedia(MultipartFile multipartFile, TruckNotification notification) {
        String fileUrl = "";

        this.deleteNotificationMedia(notification);

        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileName = "notifications/" + notification.getId() + getFileExtension(multipartFile);
            fileUrl = endpointUrl + "/" + bucketName + "/" + fileName;
            uploadFileTos3bucket(fileName, file);
            file.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return fileUrl;
    }

    public void deleteNotificationMedia(TruckNotification notification) {
        if (notification.getMedia() == null) {
            return;
        }

        String fileName = notification.getMedia().getUrl().substring(notification.getMedia().getUrl().lastIndexOf('/') + 1);
        log.info(fileName);
        s3client.deleteObject(new DeleteObjectRequest(bucketName, "notifications/" + fileName));

        Media media = notification.getMedia();
        notification.setMedia(null);
        truckNotificationService.saveTruckNotification(notification);
        mediaService.deleteMedia(media);
    }
}