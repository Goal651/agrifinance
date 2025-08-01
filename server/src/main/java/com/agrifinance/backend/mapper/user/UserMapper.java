package com.agrifinance.backend.mapper.user;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.model.user.User;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDTO(User user);
    User toEntity(UserDTO userDTO);

    List<UserDTO> toDTOs(List<User> users);
    List<User> toEntities(List<UserDTO> userDTOs);
    
}
