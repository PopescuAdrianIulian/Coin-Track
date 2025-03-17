package coin_track.crypto.service;

import coin_track.crypto.entity.Cryptocurrency;
import coin_track.crypto.entity.User;
import coin_track.crypto.repository.CryptocurrencyRepository;
import coin_track.crypto.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final CryptocurrencyRepository cryptoRepository;

    public User registerUser(String username, String email, String password) {
        log.info("Creating a new user");
        User tempUser = new User();
        tempUser.setUsername(username);
        tempUser.setEmail(email);
        tempUser.setPassword(password);
        log.info("User created!");
        return userRepository.save(tempUser);
    }

    public Optional<User> authenticateUser(String username, String password) {
        log.info("User authenticated!");
        return userRepository.findByUsername(username).filter(user -> user.getPassword().equals(password));
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @Transactional
    public void addToWatchlist(String username, String cryptoId) {
        log.info("Added to watchlist");
        userRepository.findByUsername(username).ifPresent(user -> {
            cryptoRepository.findById(cryptoId).ifPresent(cryptocurrency -> {
                user.addToWatchlist(cryptocurrency);
                userRepository.save(user);
            });
        });
    }

    public void removeFromWatchlist(String username, String cryptoId) {
        log.info("Removed from watchlist");
        userRepository.findByUsername(username).ifPresent(user -> {
            cryptoRepository.findById(cryptoId).ifPresent(cryptocurrency -> {
                user.removeFromWatchlist(cryptocurrency);
                userRepository.save(user);
            });
        });
    }

    public List<Cryptocurrency> getWatchlist(String username) {
        User tempUser = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return tempUser.getWatchlist();
    }

}
