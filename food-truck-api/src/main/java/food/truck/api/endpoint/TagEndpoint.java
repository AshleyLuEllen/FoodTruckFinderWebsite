package food.truck.api.endpoint;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagService;
import food.truck.api.data.truck.Truck;
import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

public class TagEndpoint {
    @Autowired
    private TagService tagService;

    @GetMapping("/tags/{id}")
    public Tag findTagByID(@PathVariable Long id) {
        return tagService.findTag(id).orElseThrow(ResourceNotFoundException::new);
    }

    @PostMapping("/tags")
    public Tag createTag(@RequestBody Tag tag) {
        return tagService.createTag(tag);
    }

    @PutMapping("/tags/{id}")
    public Tag saveTag(@PathVariable Long id, @RequestBody Tag tag) {
        if (!tag.getId().equals(id)) {
            throw new BadRequestException("IDs don't match");
        }

        return tagService.saveTag(tag);
    }
}
