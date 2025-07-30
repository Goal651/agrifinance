# Signup Storage Summary

## 📊 What Gets Stored in Database During Signup

When a user signs up with the following request:
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### ✅ **Database Storage:**

| Field | Value | Description |
|-------|-------|-------------|
| **id** | `UUID` | Auto-generated unique identifier |
| **firstName** | `"John"` | User's first name (2-50 characters) |
| **lastName** | `"Doe"` | User's last name (2-50 characters) |
| **email** | `"john.doe@example.com"` | User's email address (validated, unique) |
| **password** | `"$2a$10$hashed..."` | BCrypt hashed password |
| **role** | `"USER"` | Default role assigned to new users |
| **status** | `"ACTIVE"` | Account status (active by default) |

### ❌ **Not Stored During Signup:**
- **phone** - Not collected during signup
- **farmType** - Not collected during signup  
- **farmSize** - Not collected during signup
- **location** - Not collected during signup
- **address** - Not collected during signup

## 🔐 Security Features

### Password Security
- **Hashing**: Passwords are hashed using BCrypt before storage
- **Salt**: BCrypt automatically adds salt for additional security
- **Validation**: Minimum 6 characters required
- **Confirmation**: Password must match confirmPassword

### Email Security
- **Uniqueness**: Email addresses must be unique across all users
- **Validation**: Email format is validated using @Email annotation
- **Case Sensitivity**: Email addresses are stored as provided

## 🎯 User Role Assignment

All new users are automatically assigned:
- **Role**: `USER` (default role for regular users)
- **Status**: `ACTIVE` (account is immediately usable)

## 📝 Database Schema

The User entity stores the following during signup:

```sql
INSERT INTO user (
  id, 
  firstName, 
  lastName, 
  email, 
  password, 
  role, 
  status
) VALUES (
  'uuid-generated',
  'John',
  'Doe', 
  'john.doe@example.com',
  '$2a$10$hashedPassword...',
  'USER',
  'ACTIVE'
);
```

## 🔄 Response After Successful Signup

Upon successful registration, the API returns:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "role": "USER", 
    "userId": "uuid-generated"
  },
  "message": "User registered successfully"
}
```

## ✅ Validation Summary

### Input Validation
- **firstName**: Required, 2-50 characters
- **lastName**: Required, 2-50 characters
- **email**: Required, valid email format, unique
- **password**: Required, minimum 6 characters
- **confirmPassword**: Required, must match password

### Business Logic Validation
- **Email Uniqueness**: Prevents duplicate registrations
- **Password Confirmation**: Ensures passwords match
- **Role Assignment**: Automatically assigns USER role
- **Status Assignment**: Sets account to ACTIVE

## 🚀 Ready for Frontend Integration

The signup endpoint is fully functional and ready for frontend integration with:
- ✅ Complete input validation
- ✅ Secure password handling
- ✅ JWT token generation
- ✅ Proper error responses
- ✅ Database persistence 