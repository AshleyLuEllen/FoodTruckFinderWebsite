package food.truck.api.data.tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public Optional<Tag> findTag(Long tagId) {
        return tagRepository.findById(tagId);
    }

    public Tag saveTag(Tag tag) {
        return tagRepository.save(tag);
    }

    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }
}

