
## Note
1. Urls:
   - development server: http://localhost:8000
   - production server: 

## Authentication
1. Login
   - routes: http://localhost:8000/api/auth/login
   - request: 
    ```js
      // POST
     {
      "email": "ken@gmail.com",
      "password": "1234567890"
     }
    ```
   - response:
   ```js
    {
      "message": "Login successful",
      "token": "5367829rnvgrqvn",
      "user": {
        "name": "Ken",
        "dob": "01-01-1990",
        "phone": "+1234567890",
        "email": "ken@gmail.com",
        "userId": "dev123"
      }
    }
   ```

2. Signup
   - routes: http://localhost:8000/api/auth/signup
   - request:
    ```js
    // POST
    {
      "name": "Ken",
      "dob": "01-01-1990",
      "phone": "+1234567890",
      "email": "ken@gmail.com",
      "userId": "dev123",
      "password": "1234567890"
    }
    ```
   - response:
    ```js
      {
        "message": "Signup successful",
        "token": "5367829rnvgrqvn",
        "user": {
          "name": "Ken",
          "dob": "01-01-1990",
          "phone": "+1234567890",
          "email": "ken@gmail.com",
          "userId": "dev123",
        }
      }
    ```

3. Logout
   - routes: http://localhost:8000/api/auth/logout
   - request: {}
   - response: 
    ```js
      {
        "message": "Logout successful"
      }
    ```

4. Forgot Password
   - routes: http://localhost:8000/api/auth/forgot-password
   - request: 
   ```js
     // POST
     {
      "email": "ken@gmail.com"
     }
   - response:
   ```js
     {
       "message": "Password reset link sent to your email"
     }
   ```

5. Reset Password
   - routes: http://localhost:8000/api/auth/reset-password
   - request:
   ```js
     // POST
     {
       "token": "82fgv874g009awefb",
       "newPassword": "newpassword123"
     }
   ```
   - response:
   ```js
     {
       "message": "Password reset successful"
     }
   ```

## Admin
1. Admin Dashboard
   - routes: http://localhost:8000/api/admin/dashboard-data
   - request:
   - response:

<!-- zone, station, cart, train name, PNR, seat number -->
## Booking
1. Book Order
   - routes: http://localhost:8000/api/booking/book-order
   - request: 
   ```js
     // POST
     {
       "items": [
         {
           "name": "Veg Burger",
           "quantity": 2,
           "price": 250
         },
         {
           "name": "Fries",
           "quantity": 1,
           "price": 100
         }
       ],
     }
   ```
   - response:
   ```js
    {
      "id": "order_Na1bCd2EfGhIjk",
      "entity": "order",
      "amount": 50000,
      "amount_paid": 0,
      "amount_due": 50000,
      "currency": "INR",
      "receipt": "rcpt_1721895845564",
      "status": "created",
      "notes": {
        "items": "[{\"name\":\"Veg Burger\",\"quantity\":1,\"price\":500}, {\"name\":\"Fries\",\"quantity\":1,\"price\":100}]"
      },
      "created_at": 1721895845
    }
   ``` 

2. Send SMS
   - routes: http://localhost:8000/api/booking/send-sms
   - request: 
   ```js
     // POST
     {
       "phone": "+1234567890",
       "email": "Your booking is confirmed"
     }
   ```****
   - response:
   ```js
     {
       "message": "SMS sent successfully"
     }
   ``` 

## cloud Kitchen
api/cloud-kitchen
   