
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
4. Test card details for payment:
   - Card Number: 4386 2894 0766 0153
   - Expiry Date: Any future date
   - CVC: Any 3-digit number
   - Name on Card: Any name

## TODO
- [ ] Add role field to user model if possible to get cloud kitchen, admin, customers & delivery partners in single model, what input should be given for cloud kitchen?
- [ ] what things should be added in admin dashboard?
- [ ] what details should be returned in cloud kitchen orders route?
- [ ] what data should be collected at signup, book-order?
- [ ] change password reset url to point to the new frontend url.
- [ ] what types of offers should be added? age based, pre-booking based, coupons for ordering n times, etc.
- [ ] look into sms

### TODO (minor)
- [ ] calculate total amount in process-order route
- [ ] calculate age using dob
- [ ] add validation for phone number, email, dob, userId, password
- [ ] think about using coupons
- [ ] open github & render account, then deploy
- [ ] change cors origin
- [ ] check DB schema is in sync?
- [ ] display price in food-preference & send it accordingly to backend

### Frontend Bugs
- show selected option in each page
- persist details across all pages
- add forgot password & password reset features
- unwanted page: category, menu list
- display price in food-preference

## Changes made
- returned id while logging in.

## DB Schema
1. User
   ```js
    {
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        minlength: [10, "Phone number must be at least 10 digits long"],
        trim: true,
        validate: {
          validator: function(v) {
            return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(v); 
          },
          message: props => `${props.value} is not a valid phone number!`
          // This regex makes sure that: the number starts with +91, 91 or 0, followed by a digit that starts with a  between 6-9 and then followed by 9 digits.
        }
      },
      name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be at most 50 characters long"],
        validate: {
          validator: function(v) {
            return /^[a-zA-Z\s]+$/.test(v); 
          },
          message: props => `${props.value} is not a valid name!`
          // This regex makes sure that: the name contains only alphabets and spaces.
        }, 
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        validate: {
          validator: function(v) {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
          },
          message: props => `${props.value} is not a valid email!`
          // This regex checks for a valid email format.
        }
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
          validator: function(v) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v); 
          },
          message: props => `${props.value} is not a valid password!`
          // This regex checks for a valid password format: at least one lowercase letter, one uppercase letter, one digit, and at least 8 characters long.
        },
        select: false,
      },
      userId: {
        type: String,
        required: [true, "User ID is required"],
        unique: true,
        trim: true,
        minlength: [6, "User ID must be at least 6 characters long"],
        maxlength: [50, "User ID must be at most 50 characters long"],
        validate: {
          validator: function(v) {
            return /^[a-zA-Z0-9]+$/.test(v);
          },
          message: props => `${props.value} is not a valid User ID!`
          // This regex checks for a valid User ID format: alphanumeric characters only.
        }
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      }
    }
   ```

2. Product
  ```js
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price must be a positive number"],
        default: 0,
      },
      image: {
        type: String,
        required: true,
        trim: true,
      }
    }
  ```

3. Order
   ```js
    {
      userId: {
        ref: "User", // reference to User model
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      items: [
        {
          productId: {
            ref: "Product", // reference to Product model
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
          },
        }
      ],
      zone: {
        type: String,
        required: true,
        trim: true,
      },
      station: {
        type: String,
        required: true,
        trim: true,
      },
      trainDetails: {
        trainName: {
          type: String,
          required: true,
          trim: true,
        },
        pnr: {
          type: String,
          required: true,
          trim: true,
        },
        seatNumber: {
          type: String,
          required: true,
          trim: true,
        },
        coach: {
          type: String,
          required: true,
          trim: true,
        },
        trainNumber: {
          type: Number,
          required: true,
        }
      }
    }
   ```

## Authentication
1. Login
   - routes: http://localhost:8000/api/auth/login
   - request: 
    ```js
      // POST
     {
      "userId": "ken123m",
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
      "dob": "1990-01-01", // or as Date object
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
          "id": "45631gekmler13rf",
          "name": "Ken",
          "dob": "2005-12-14T00:00:00.000Z",
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
    // POST
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
      "userId": "ken34"
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
      "amount": 50000,  // returns in paise
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
          "pnr": "123456789012",
          "seatNumber": "69y",
          "coach": "S1",
          "trainNo": 2345678
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


