# Hungry Harbor

![home-page-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Fhome.png?alt=media&token=737ce55d-c2df-4e95-a58c-068a364ef569)

## About

This is an online food ordering app with two sections **user section** and **admin section**.

User interacts with user section to browse items, place orders, track their orders and review items.

The admin interacts with the admin section to manage items and recieved orders and analyse the business.

This website is also fully **mobile responsive**.

## Tech Stack

This project is built using **Next.js, MongoDB and Socket.io and Razorpay as a secure payment gateway**.

## Deployment

This application consist of two servers :

- **Next.js Server**: To server the frontend and handling backend request. It is deployed on AWS.

- **Express Server**: This server incorporates **Socket.io** to send realtime update of orders and notifications and to do some **scheduled analytics jobs**. It is deployed on AWS.

Main Website: [hungryharbor.tonmoy1912.in](https://hungryharbor.tonmoy1912.in/ "Hungry Harbor")

Express Sever Github Link: [Tonmoy1912/hungry-harbor-socket-server](https://github.com/Tonmoy1912/hungry-harbor-socket-server)

## All User Section Features

### 1. Browse Items

User can browse all the items, filter the items by category and search item by name as well.

![item-page-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Fitem-page.png?alt=media&token=ec517afc-bc5c-4094-9d92-7b5eff7005aa)

### 2. Add Items to Cart

User can add items to cart prior to place order.

![cart-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Fcart.png?alt=media&token=15c4c798-9729-4fc9-b257-7f78cf6b7667)

### 3. Place Order

User can place order and make payment using various payment methods (ex:- UPI, Netbanking, Card etc.) provided by **Razorpay payment gateway**. 

![order-payment-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Forder-payment.png?alt=media&token=107ee416-9cd5-4e67-acb1-96a98ffb7423)

### 4. Track Order

Track your order in realtime.

![track-order-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Ftrackorder.png?alt=media&token=d203e323-4e89-4997-9545-933f48661d99)

### 5. Notification

Get instant notification.

![notification-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Fnotification.png?alt=media&token=83eebd7c-3b03-43fd-849e-5de9d7a0a6ee)

### 6. Review

See the reviews of any item and submit your own review about the item.

![review-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Freview.png?alt=media&token=c39f5662-e4db-4989-9e5f-0035bb684061)

## All Admin Section Features

### 1. Dashboard

Analyse and keep track of your business.

![sells-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Fsells.png?alt=media&token=0e73e07d-7dfb-4248-a060-462da5d4ccf7)

![placed-cancelled-order](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Forders-cancelledorders.png?alt=media&token=0ae811b6-a1eb-4d5f-b390-19ee482ff7ec)

### 2. Manage Received Orders

![received-order-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Freceivedorder.png?alt=media&token=d7e6fb62-68c1-4121-91b9-e053dc67c6ef)

### 3. Manage Items

The admin can add, remove and update items. Admin can also set **preference order** of items by it's global and categorical order property. ***The lower the order value the higher the preference***.

![manage-items-image](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Fmanage-items.png?alt=media&token=cc8a2a3e-aaf1-4a83-8826-e50b856de87e)

### 4. Manage Admins

The admin can also add other admin and also remove them.

![admin-page](https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/readme-images%2Fadmin.png?alt=media&token=956ce496-a86d-4aed-ad48-71b25f730e4c)