
## Note
1. Urls:
   - development server: http://localhost:8000
   - production server: <not yet specified>
2. Handling Errors in frontend:
   - use `try-catch` blocks around API calls.
   - In the `catch` block, To access the error message, use 
   ```js
    error.response?.data?.message || error.message || "An error occurred. Please try again later."
   ```
3. Make sure to return token in header for every API calls. 
   - Eg:
    ```js
      const res = await axiosInstance.post(
        "/payment/send-sms", // route - backend url
        { 
          paymentResponse: response, 
          number: userData.phone, 
          email: userData.email 
        }, // request body - sent to backend
        {
          headers: {
            Authorization: `Bearer ${token}`, // include token here
          },
        } // headers - sent to backend for authentication purposes
      );
    ```

## TODO
- [ ] Add role field to user model if possible to get cloud kitchen, admin, customers & delivery partners in single model, what input should be given for cloud kitchen?
- [ ] what things should be added in admin dashboard?
- [ ] what details should be returned in cloud kitchen orders route?
- [ ] what data should be collected at signup, book-order?


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
        "id": "45631gekmler13rf",
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
      "dob": "01-01-1990", // or as Date object
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
   ```
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
       "message": "Password reset successful. Try logging in with your new password"
     }
   ```

## Booking
1. Process Order
   - routes: http://localhost:8000/api/booking/process-order
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

2. Book Order
    - routes: http://localhost:8000/api/booking/book-order
    - request: 
    ```js
      // POST
      {
        "zone": "Chennai Division Zone",
        "station": "MGR Chennai Central",
        "trainDetails": {
          "trainName": "Chennai Express",
          "PNR": "123456789012",
          "seatNumber": "69y"
        },
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
        "message": "Order booked successfully"
      }
    ```

3. Send SMS
   - routes: http://localhost:8000/api/booking/send-sms
   - request: 
   ```js
     // POST
     {
       "phone": "+1234567890",
       "email": "Your booking is confirmed"
     }
   ```
   - response:
   ```js
     {
       "message": "SMS sent successfully"
     }
   ``` 

## Admin
1. Admin Dashboard
   - routes: http://localhost:8000/api/admin/dashboard-data
   - request: 
   ```js
     // GET
     {}
   ```
   - response:
    ```js
      {
        "totalOrdersToday": 100,
        "totalRevenueToday": 500000,
        "averageOrderTime": 200,
        "orders": [
          {
            "id": "order_1234567890",
            "customerName": "John Doe",
            "train": "Chennai Express",
            "trainNo": 2345678,
            "pnr": "123456789012",
            "seat": "69y",
            "route": "Chennai to Delhi",
            "Amount": 500,
            "time": "2023-01-01T10:00:00Z",
          }
        ]
      }
    ```

2. Delete Order
   - routes: http://localhost:8000/api/admin/delete-order/:orderId
   - request: 
   ```js
     // DELETE
     {}
   ```
   - response:
   ```js
     {
       "message": "Order deleted successfully"
     }
   ```

## cloud Kitchen
1. Get Orders
   - routes: http://localhost:8000/api/cloud-kitchen/:id/orders // where :id is the cloud kitchen id
   - request: 
   ```js
     // GET
     {}
   ```
   - response:
    ```js
      {
        "orders": [
          {
            "id": "order_1234567890",
            "customerName": "John Doe",
            "train": "Chennai Express",
            "trainNo": 2345678,
            "pnr": "123456789012",
            "seat": "69y",
            "route": "Chennai to Delhi",
            "Amount": 500,
            "time": "2023-01-01T10:00:00Z",
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
            ]
          }
        ]
      }
    ```


