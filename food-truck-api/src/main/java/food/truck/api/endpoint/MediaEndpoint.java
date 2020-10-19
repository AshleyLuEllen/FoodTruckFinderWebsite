package food.truck.api.endpoint;

import food.truck.api.client.AmazonClient;
import food.truck.api.data.media.Media;
import food.truck.api.data.media.MediaService;
import food.truck.api.data.media.MediaType;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.security.Principal;
import java.util.Optional;

@Log4j2
@RestController
public class MediaEndpoint {
    private AmazonClient amazonClient;

    @Autowired
    private UserService userService;

    @Autowired
    private MediaService mediaService;

    @Autowired
    MediaEndpoint(AmazonClient amazonClient) {
        this.amazonClient = amazonClient;
    }

    @PutMapping("/media/profiles/me")
    public Media uploadProfilePicture(@RequestPart(value = "file") MultipartFile file, Principal principal) {
        if (principal == null || principal.getName() == null) {
            throw new UnauthorizedException();
        }
        System.out.println("here");

        Optional<User> user = userService.findUserByEmailAddress(principal.getName());

        if (user.isEmpty()) {
            System.out.println("here");
            throw new ResourceNotFoundException();
        }

        String url = this.amazonClient.uploadProfilePicture(file, user.get().getId());

        Media newMedia = new Media();

        newMedia.setDataType(MediaType.PROFILE_IMAGE);
        newMedia.setHidden(false);
        newMedia.setUrl(url);

        Media dbMedia = mediaService.createMedia(newMedia);

        User meUser = user.get();
        meUser.setAvatar(dbMedia);
        userService.saveUser(meUser);

        return dbMedia;
    }

//    @DeleteMapping("/media/profiles/me")
//    public void deleteProfilePicture(Principal principal) {
//        if (principal == null || principal.getName() == null) {
//            throw new UnauthorizedException();
//        }
//
//        Optional<User> user = userService.findUserByEmailAddress(principal.getName());
//
//        if (user.isEmpty()) {
//            throw new ResourceNotFoundException();
//        }
//
//        this.amazonClient.deleteProfilePicture(user.get().getId());
//    }

//    @PostMapping("/uploadFile")
//    public String uploadFile(@RequestPart(value = "file") MultipartFile file) {
//        return this.amazonClient.uploadFile(file);
//    }
//
//    @DeleteMapping("/deleteFile")
//    public String deleteFile(@RequestPart(value = "url") String fileUrl) {
//        return this.amazonClient.deleteFileFromS3Bucket(fileUrl);
//    }
}
