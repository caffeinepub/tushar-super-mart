import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    available : Bool;
    quantity : Nat;
    image : ?Storage.ExternalBlob;
  };

  public type DeliveryDetails = {
    name : Text;
    address : Text;
    phone : Text;
    email : Text;
    city : Text;
    postalCode : Text;
    deliveryInstructions : ?Text;
    preferredDeliveryTime : ?Text;
  };

  public type Order = {
    id : Text;
    customer : ?Principal;
    orderTime : Time.Time;
    deliveryTime : Time.Time;
    total : Nat;
    status : OrderStatus;
    deliveryDetails : DeliveryDetails;
    products : [Product];
  };

  public type OrderStatus = { #pending; #confirmed; #shipped; #delivered; #cancelled };

  public type Offer = {
    id : Text;
    title : Text;
    description : Text;
    banner : ?Storage.ExternalBlob;
    startDate : Time.Time;
    endDate : Time.Time;
    isActive : Bool;
  };

  public type Customer = {
    id : Text;
    contact : DeliveryDetails;
    orders : [Order];
  };

  module CompareProduct {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  module CompareOffer {
    public func compare(o1 : Offer, o2 : Offer) : Order.Order {
      Text.compare(o1.id, o2.id);
    };
  };

  module CompareOrder {
    public func compare(o1 : Order, o2 : Order) : Order.Order {
      Text.compare(o1.id, o2.id);
    };
  };

  module CompareCustomer {
    public func compare(c1 : Customer, c2 : Customer) : Order.Order {
      Text.compare(c1.id, c2.id);
    };
  };

  var orderCounter = 0;
  var productCounter = 0;
  var offerCounter = 0;
  let products = Map.empty<Text, Product>();
  let offers = Map.empty<Text, Offer>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func seedDemoContent() {
    if (products.isEmpty()) {
      let demoProducts = List.fromArray<Product>([
        { id = "prod1"; name = "Apples"; description = "Fresh red apples"; available = true; quantity = 50; price = 249; image = null },
        { id = "prod2"; name = "Bananas"; description = "Organic bananas"; available = true; quantity = 30; price = 199; image = null },
        { id = "prod3"; name = "Grapes"; description = "Seedless green grapes"; available = true; quantity = 20; price = 349; image = null },
        { id = "prod4"; name = "Orange Juice"; description = "Freshly squeezed orange juice"; available = true; quantity = 15; price = 499; image = null },
        { id = "prod5"; name = "Strawberries"; description = "Seasonal strawberries (small pack)"; available = true; quantity = 10; price = 599; image = null },
        { id = "prod6"; name = "Mixed Fruit Basket"; description = "Assorted fruits (large basket)"; available = true; quantity = 5; price = 2499; image = null },
      ]);
      demoProducts.forEach(
        func(product) {
          products.add(product.id, product);
        }
      );
      productCounter := 7;
    };

    if (offers.isEmpty()) {
      let currentTime = Time.now();
      offers.add(
        "offer1",
        {
          id = "offer1";
          title = "Mango Festival";
          description = "Special discounts on mangoes and related products.";
          banner = null;
          startDate = currentTime;
          endDate = currentTime + 604800000000000;
          isActive = true;
        },
      );
      offerCounter := 2;
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management - Customer Functions (No auth required - guests can browse)
  public query func searchProducts(term : Text) : async [Product] {
    let filteredProducts = products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text(term.toLower())) or
        product.description.toLower().contains(#text(term.toLower()));
      }
    );
    filteredProducts.sort();
  };

  public query func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Product Management - Admin Functions
  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Nat, quantity : Nat, available : Bool, image : ?Storage.ExternalBlob) : async Text {
    let id = "prod" # productCounter.toText();
    let newProduct : Product = {
      id;
      name;
      description;
      price;
      available;
      quantity;
      image;
    };
    products.add(id, newProduct);
    productCounter += 1;
    id;
  };

  public shared ({ caller }) func updateProduct(id : Text, name : Text, description : Text, price : Nat, quantity : Nat, available : Bool, image : ?Storage.ExternalBlob) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          available;
          quantity;
          image;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    ignore products.remove(id);
  };

  // Offer Management - Customer Functions (No auth required - guests can view active offers)
  public query func getActiveOffers() : async [Offer] {
    offers.values().toArray().filter(
      func(offer) {
        let now = Time.now();
        offer.isActive and now >= offer.startDate and now <= offer.endDate
      }
    ).sort();
  };

  public query ({ caller }) func getAllOffers() : async [Offer] {
    offers.values().toArray().sort();
  };

  // Offer Management - Admin Functions
  public shared ({ caller }) func createOffer(title : Text, description : Text, banner : ?Storage.ExternalBlob, startDate : Time.Time, endDate : Time.Time, isActive : Bool) : async Text {
    let id = "offer" # offerCounter.toText();
    let newOffer : Offer = {
      id;
      title;
      description;
      banner;
      startDate;
      endDate;
      isActive;
    };
    offers.add(id, newOffer);
    offerCounter += 1;
    id;
  };

  public shared ({ caller }) func updateOffer(id : Text, title : Text, description : Text, banner : ?Storage.ExternalBlob, startDate : Time.Time, endDate : Time.Time, isActive : Bool) : async () {
    switch (offers.get(id)) {
      case (null) { Runtime.trap("Offer does not exist") };
      case (?_) {
        let updatedOffer : Offer = {
          id;
          title;
          description;
          banner;
          startDate;
          endDate;
          isActive;
        };
        offers.add(id, updatedOffer);
      };
    };
  };

  public shared ({ caller }) func activateOffer(id : Text) : async () {
    switch (offers.get(id)) {
      case (null) { Runtime.trap("Offer does not exist") };
      case (?offer) {
        let updatedOffer : Offer = {
          id = offer.id;
          title = offer.title;
          description = offer.description;
          banner = offer.banner;
          startDate = offer.startDate;
          endDate = offer.endDate;
          isActive = true;
        };
        offers.add(id, updatedOffer);
      };
    };
  };

  public shared ({ caller }) func deactivateOffer(id : Text) : async () {
    switch (offers.get(id)) {
      case (null) { Runtime.trap("Offer does not exist") };
      case (?offer) {
        let updatedOffer : Offer = {
          id = offer.id;
          title = offer.title;
          description = offer.description;
          banner = offer.banner;
          startDate = offer.startDate;
          endDate = offer.endDate;
          isActive = false;
        };
        offers.add(id, updatedOffer);
      };
    };
  };

  public shared ({ caller }) func deleteOffer(id : Text) : async () {
    ignore offers.remove(id);
  };

  // Order Management - Customer Functions
  public shared ({ caller }) func placeOrder(customer : ?Principal, customerInfo : DeliveryDetails, orderProducts : [Product]) : async Text {
    // Allow any caller (guest, user, admin) to place orders
    if (orderProducts.size() == 0) {
      Runtime.trap("Cannot place order with no products");
    };
    for (product in orderProducts.vals()) {
      switch (products.get(product.id)) {
        case (null) { Runtime.trap("Product " # product.id # " does not exist") };
        case (?existingProduct) {
          if (not existingProduct.available) {
            Runtime.trap("Product " # product.id # " is not available");
          };
          if (existingProduct.quantity < product.quantity) {
            Runtime.trap("Insufficient quantity for product " # product.id);
          };
        };
      };
    };
    let newOrder : Order = {
      id = orderCounter.toText();
      customer;
      products = orderProducts;
      orderTime = Time.now();
      deliveryTime = Time.now();
      total = orderProducts.foldLeft(0, func(acc : Nat, product : Product) : Nat { acc + product.price });
      deliveryDetails = customerInfo;
      status = #pending;
    };
    orders.add(orderCounter.toText(), newOrder);
    let orderId = orderCounter.toText();
    orderCounter += 1;
    orderId;
  };

  public query ({ caller }) func getOrder(id : Text) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        // Allow admin to view any order, or customer to view their own order
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          switch (order.customer) {
            case (null) { Runtime.trap("Unauthorized: Cannot view this order") };
            case (?customer) {
              if (customer != caller) {
                Runtime.trap("Unauthorized: Can only view your own orders");
              };
            };
          };
        };
        order;
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    orders.values().toArray().filter(
      func(order) {
        switch (order.customer) {
          case (null) { false };
          case (?customer) { customer == caller };
        };
      }
    ).sort();
  };

  // Order Management - Admin Functions
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort();
  };

  public shared ({ caller }) func updateOrderStatus(id : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          customer = order.customer;
          products = order.products;
          orderTime = order.orderTime;
          deliveryTime = order.deliveryTime;
          total = order.total;
          deliveryDetails = order.deliveryDetails;
          status;
        };
        orders.add(id, updatedOrder);
      };
    };
  };

  // Customer Management - Admin Functions
  public query ({ caller }) func getAllCustomers() : async [Customer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all customers");
    };
    let customers = Map.empty<Text, Customer>();

    orders.values().forEach(
      func(order) {
        switch (customers.get(order.deliveryDetails.phone)) {
          case (null) {
            customers.add(
              order.deliveryDetails.phone,
              {
                id = order.deliveryDetails.phone;
                contact = order.deliveryDetails;
                orders = [order];
              },
            );
          };
          case (?customer) {
            let existingOrders = List.fromArray<Order>(customer.orders);
            existingOrders.add(order);
            customers.add(
              order.deliveryDetails.phone,
              {
                id = customer.id;
                contact = customer.contact;
                orders = existingOrders.toArray();
              },
            );
          };
        };
      }
    );
    customers.values().toArray().sort();
  };

  public query ({ caller }) func getCustomer(id : Text) : async ?Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view customer details");
    };
    let customers = Map.empty<Text, Customer>();

    orders.values().forEach(
      func(order) {
        switch (customers.get(order.deliveryDetails.phone)) {
          case (null) {
            customers.add(
              order.deliveryDetails.phone,
              {
                id = order.deliveryDetails.phone;
                contact = order.deliveryDetails;
                orders = [order];
              },
            );
          };
          case (?customer) {
            let existingOrders = List.fromArray<Order>(customer.orders);
            existingOrders.add(order);
            customers.add(
              order.deliveryDetails.phone,
              {
                id = customer.id;
                contact = customer.contact;
                orders = existingOrders.toArray();
              },
            );
          };
        };
      }
    );
    customers.get(id);
  };

  // Initialization
  public shared ({ caller }) func init() : async () {
    seedDemoContent();
    Runtime.trap("Not callable: Artificial Runtime.trap to suppress returning the unit type");
  };
};
