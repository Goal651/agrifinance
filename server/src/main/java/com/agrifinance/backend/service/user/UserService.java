package com.agrifinance.backend.service.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.exception.UserNotFoundException;
import com.agrifinance.backend.mapper.user.UserMapper;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public Optional<User> findUserById(UUID id) {
        return userRepository.findById(id);
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    public UserDTO getUserDtoById(UUID id) {
        User user = getUserById(id);
        return userMapper.toDTO(user);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public UserDTO saveUserDto(User user) {
        User savedUser = saveUser(user);
        return userMapper.toDTO(savedUser);
    }

    public User updateUser(User user) {
        if (!userRepository.existsById(user.getId())) {
            throw new UserNotFoundException("User not found with id: " + user.getId());
        }
        return userRepository.save(user);
    }

    public UserDTO updateUser(UserDTO userDTO) {
        User existingUser = getUserById(userDTO.getId());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setFirstName(userDTO.getFirstName());
        existingUser.setLastName(userDTO.getLastName());
        
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toDTO(updatedUser);
    }
}
