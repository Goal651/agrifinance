package com.agrifinance.backend.service.user;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getUserById(UUID id) {
        User user = userRepository.findById(id).orElseThrow();
        return user;
    }

    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return user;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(UserDTO newUser) {
        User oldUser = userRepository.findById(newUser.getId()).orElseThrow();
        oldUser.setEmail(newUser.getEmail());
        oldUser.setFirstName(newUser.getFirstName());
        oldUser.setLastName(newUser.getLastName());
        return userRepository.save(oldUser);
    }

}
