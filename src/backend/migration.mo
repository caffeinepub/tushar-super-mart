import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

module {
  type OldUserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type OldProduct = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    available : Bool;
    quantity : Nat;
    image : ?Storage.ExternalBlob;
  };

  type OldDeliveryDetails = {
    name : Text;
    address : Text;
    phone : Text;
    email : Text;
    city : Text;
    postalCode : Text;
    deliveryInstructions : ?Text;
    preferredDeliveryTime : ?Text;
  };

  type OldOrder = {
    id : Text;
    customer : ?Principal;
    orderTime : Time.Time;
    deliveryTime : Time.Time;
    total : Nat;
    status : OrderStatus;
    deliveryDetails : OldDeliveryDetails;
    products : [OldProduct];
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  type OldOffer = {
    id : Text;
    title : Text;
    description : Text;
    banner : ?Storage.ExternalBlob;
    startDate : Time.Time;
    endDate : Time.Time;
    isActive : Bool;
  };

  type OldCustomer = {
    id : Text;
    contact : OldDeliveryDetails;
    orders : [OldOrder];
  };

  module CompareProduct {
    public func compare(p1 : OldProduct, p2 : OldProduct) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  module CompareOffer {
    public func compare(o1 : OldOffer, o2 : OldOffer) : Order.Order {
      Text.compare(o1.id, o2.id);
    };
  };

  module CompareOrder {
    public func compare(o1 : OldOrder, o2 : OldOrder) : Order.Order {
      Text.compare(o1.id, o2.id);
    };
  };

  module CompareCustomer {
    public func compare(c1 : OldCustomer, c2 : OldCustomer) : Order.Order {
      Text.compare(c1.id, c2.id);
    };
  };

  type OldActor = {
    orderCounter : Nat;
    productCounter : Nat;
    offerCounter : Nat;
    products : Map.Map<Text, OldProduct>;
    offers : Map.Map<Text, OldOffer>;
    orders : Map.Map<Text, OldOrder>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    accessControlState : AccessControl.AccessControlState;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : OldActor {
    { old with orderCounter = old.orderCounter };
  };
};
