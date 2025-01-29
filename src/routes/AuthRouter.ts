import { Request, Response, Router } from 'express';
import {
  LoginUser,
  RefreshAccessToken,
  RegisterUser,
} from '../controllers/AuthController';
import { emailValidationMiddleware } from '../middlware/ValiationMiddleware';
import { registerLimit } from '../utils/RateLimiting';

const authRouter = Router();

authRouter.post(
  '/register',
  registerLimit,
  emailValidationMiddleware,
  RegisterUser
);
authRouter.post('/login', LoginUser);

authRouter.post('/refreshToken', RefreshAccessToken);
authRouter.post('/logout', (req: Request, res: Response) => {
  // Clear the refresh token cookie
  res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default authRouter;
/**
 * Creating a robust and secure **user registration API** is critical for ensuring a seamless user experience and maintaining the integrity and security of your application. Below is an extensive guide to help you design and implement a proper user registration API, covering everything from planning and validation to security and scalability.
 * 1. Understand Business and Functional Requirements/    ✔
     - Determine what information is required to register a user. Typically:  ✔
     - **Mandatory fields**: Email, password, name, and phone number (if applicable).   ✔
     - **Optional fields**: Address, profile picture, date of birth, etc.    ✔
   - Define any rules for unique identifiers like email, username, or phone number.    ✔
   - Clarify any business logic, such as password strength requirements, username constraints, or input formats.    ✔

---

### **2. Input Validation and Sanitization**
   Input validation is one of the most critical steps to prevent issues such as invalid data and security vulnerabilities (e.g., SQL injection or XSS attacks).

   - **Validation**:
     - Ensure all required fields are present.      ✔
     - Validate email format (e.g., using a regex).      ✔
     - Validate phone number format (e.g., including country code).
     - Check that usernames, if required, conform to business rules (e.g., length and allowed characters).           ✔
     - Password validation: Enforce rules for minimum length, special characters, uppercase/lowercase letters, and digits.   ✔

   - **Sanitization**:
     - Strip out unnecessary or dangerous characters (e.g., HTML tags or special characters that can be used for injection attacks).
     - Normalize inputs like emails (convert to lowercase) for consistency.

---

### **3. Password Handling**
   Handling passwords securely is critical to protecting user data.

   - **Hashing**:
     - Never store plaintext passwords.             ✔ 
     - Use strong hashing algorithms like **bcrypt**, **Argon2**, or **PBKDF2** to hash passwords before storing them.
   - **Salting**:          ✔
     - Add a unique salt to each password before hashing to prevent rainbow table attacks.
   - **Password Strength**:      
     - Enforce a strong password policy to reduce the risk of brute force attacks.
   - **Rate Limiting**:   ✔
     - Prevent multiple failed registration attempts from the same IP to avoid automated abuse.

---

### **4. Email and Phone Number Verification**
   Ensure the user owns the email or phone number they are registering with.

   - **Send Verification Code/Link**:
     - Send a verification email or SMS with a unique, time-sensitive code or link.
   - **Verification Workflow**:
     - Allow the account to be created but mark it as unverified until the user completes the verification.
   - **Token Expiry**:
     - Set an expiration time for the verification link or code (e.g., 15 minutes).
   - **Resend Option**:
     - Provide an option to resend the verification email or SMS, with rate limiting to prevent abuse.

---

### **5. Data Uniqueness**    ✔
   - Ensure that unique fields like email, username, or phone number are not already in use.
   - Use a database constraint or a check during the registration process to prevent duplicate accounts.

---

### **6. Secure Communication**
   - **Use HTTPS**:
     - Ensure all communication between the client and the server is encrypted using HTTPS to prevent man-in-the-middle attacks.
   - **CORS**:               
     - Configure CORS to allow requests only from trusted origins.

---

### **7. API Rate Limiting**     
   - Implement rate limiting to prevent abuse (e.g., multiple registrations from the same IP in a short period). ✔
   - Return a proper HTTP status code (e.g., `429 Too Many Requests`) when the limit is exceeded.

---

### **8. Error Handling**
   - Provide clear and consistent error messages without exposing sensitive information. 
   - Common error cases:
     - Missing fields.
     - Invalid input formats.
     - Duplicate entries (e.g., email already in use).
     - Failed email/SMS delivery for verification.
   - Use appropriate HTTP status codes:
     - `400 Bad Request`: For validation errors.
     - `409 Conflict`: For duplicate entries (e.g., email or username already exists).
     - `500 Internal Server Error`: For unexpected server errors.

---

### **9. Auditing and Logging**
   - Log registration attempts for auditing and troubleshooting:
     - Log only essential details like IP address and timestamp (avoid logging sensitive data like passwords).
     - Track failed registration attempts to identify patterns of abuse.

---

### **10. Security Considerations**
   - **CSRF Protection**:
     - Use tokens (e.g., CSRF tokens) to prevent cross-site request forgery attacks.
   - **DoS Protection**:
     - Use tools like rate limiting, IP blacklisting, or cloud-based services like Cloudflare to prevent denial-of-service attacks.
   - **Input Filtering**:
     - Sanitize all inputs to avoid injection attacks (e.g., SQL, NoSQL, and command injections).
   - **OAuth/Social Logins**:
     - If using third-party logins (e.g., Google, Facebook), validate tokens securely.

---

### **11. Scalability and Performance**
   - **Database Indexing**:
     - Index fields like email, username, and phone number to speed up uniqueness checks.
   - **Asynchronous Operations**:  
     - Use background jobs for non-essential tasks like sending verification emails or SMS to avoid blocking the API response.
   - **Caching**:
     - Use caching solutions (e.g., Redis) for rate limiting or session management to reduce load on your database.

---

### **12. Testing**
   - Perform thorough testing of the registration API, including:
     - Unit tests for input validation and business logic.
     - Integration tests for end-to-end scenarios (e.g., successful registration, failed registration).
     - Load testing to simulate high traffic and ensure the API scales properly.
     - Security testing to identify vulnerabilities (e.g., penetration testing, fuzz testing).

---

### **13. API Documentation**
   - Provide detailed API documentation for developers, including:
     - Endpoint details: HTTP method, request body format, and response format.
     - Error codes and their meanings.
     - Example requests and responses.

---

### **14. User Feedback**
   - Provide clear feedback to the user:
     - Success: Inform the user that the registration was successful and what steps to follow next (e.g., "Check your email for a verification link").
     - Failure: Provide actionable error messages (e.g., "Email is already registered. Please log in or reset your password.").

---

### **15. Post-Registration Workflow**
   - **Welcome Email**:
     - Send a welcome email to new users with a personalized message and information about the next steps.
   - **Default Profile Setup**:
     - Optionally, create a default profile or settings for new users (e.g., default avatar, language preference).
   - **Session Management**:
     - Consider logging in the user automatically after successful registration, or return a token for them to log in later.

---

### Example Workflow:
1. **User Submits Registration Request**:      ✔
   - Input: Email, password, name, etc.
2. **API Validates Input**:                  ✔
   - Check mandatory fields and validate formats.
3. **Check for Duplicates**:                    ✔
   - Ensure email/username is not already in use.
4. **Hash the Password**:             ✔
   - Hash the password securely before storing it.
5. **Save User to Database**:          ✔
   - Store user data in the database (mark as unverified if verification is required).
6. **Send Verification Email/SMS**:
   - Generate a verification token and send it to the user.
7. **Respond to Client**:
   - Return success or failure response with relevant details.

By carefully planning and following these steps, your registration API will be secure, efficient, and user-friendly, laying a solid foundation for your application. */
