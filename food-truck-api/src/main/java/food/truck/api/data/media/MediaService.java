package food.truck.api.data.media;

import food.truck.api.client.AmazonClient;
import food.truck.api.data.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MediaService {
    @Autowired
    private MediaRepository mediaRepository;

    public Optional<Media> findMedia(Long mediaId) {
        return mediaRepository.findById(mediaId);
    }

    public Media saveMedia(Media media) {
        return mediaRepository.save(media);
    }

    public Media createMedia(Media media) {
        return mediaRepository.save(media);
    }

    public void deleteMedia(Media media) {
        mediaRepository.delete(media);
    }

}

