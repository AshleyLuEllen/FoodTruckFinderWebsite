package food.truck.api.data.friends;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck_tag.TruckTag;
import food.truck.api.data.user.User;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FriendService {
    @Autowired
    private FriendPairRepository friendPairRepository;

    public boolean areFriends(User user1, User user2) {
        return friendPairRepository.existsByUser1AndUser2(user1, user2);
        // return friendPairRepository.existsByUser1AndUser2(user1, user2) || friendPairRepository.existsByUser1AndUser2(user2, user1);
    }

    public Optional<FriendPair> findFriendPair(User user1, User user2) {
        // Check left-association
        Optional<FriendPair> friendPairOpt = friendPairRepository.findById(new FriendPairId(user1.getId(), user2.getId()));
        if (friendPairOpt.isPresent()) {
            return friendPairOpt;
        }

        // Check right-association
        return friendPairRepository.findById(new FriendPairId(user2.getId(), user1.getId()));
    }

    public List<User> findAllFriendsOfUser(User user) {
        Stream<User> leftStream = friendPairRepository.findAllByUser1(user).stream().map(FriendPair::getUser2);
        Stream<User> rightStream = friendPairRepository.findAllByUser2(user).stream().map(FriendPair::getUser1);

        return Stream.concat(leftStream, rightStream).collect(Collectors.toList());
    }

    public FriendPair becomeFriends(User user1, User user2) {
        Optional<FriendPair> friendPairOpt = this.findFriendPair(user1, user2);

        if (friendPairOpt.isPresent()) {
            return friendPairOpt.get();
        }

        FriendPair friendPair = new FriendPair();
        friendPair.setUser1(user1);
        friendPair.setUser2(user2);

        return friendPairRepository.save(friendPair);
    }

    public void removeFriends(User user1, User user2) {
        if (!this.areFriends(user1, user2)) {
            throw new ResourceNotFoundException();
        }

        friendPairRepository.deleteById(new FriendPairId(user1.getId(), user2.getId()));
        // friendPairRepository.deleteById(new FriendPairId(user2.getId(), user1.getId()));
    }
}
