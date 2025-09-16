// User data
let menuItems = [];
let orders = []; // {buyer, request, name, price, category, status}
let userRole = null;

// Login via Role
function loginRole(role){
  userRole = role;
  document.getElementById("loginPage").classList.add("hidden");
  if(role==="admin"){
    document.getElementById("adminPage").classList.remove("hidden");
    displayMenu();
    displayAllOrders();
    displayNewOrders();
  } else {
    document.getElementById("customerPage").classList.remove("hidden");
    displayMenu();
    displayOrders();
    displayCustomerInbox();
  }
}

// Add Menu (Admin)
function addMenu(){
  const name = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("itemPrice").value);
  const category = document.getElementById("itemCategory").value;
  menuItems.push({name, price, category});
  displayMenu();
  return false;
}

// Delete Menu
function deleteMenu(index){
  const removed = menuItems.splice(index,1)[0];
  orders = orders.filter(o=>o.name!==removed.name);
  displayMenu(); displayOrders(); displayAllOrders(); displayNewOrders(); displayCustomerInbox();
}

// Display Menu
function displayMenu(){
  const foodList = document.getElementById("foodList");
  const drinkList = document.getElementById("drinkList");
  const customerFood = document.getElementById("customerFood");
  const customerDrink = document.getElementById("customerDrink");

  foodList.innerHTML=""; drinkList.innerHTML=""; customerFood.innerHTML=""; customerDrink.innerHTML="";

  menuItems.forEach((item,index)=>{
    // Admin lists
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - RM${item.price.toFixed(2)} <button onclick="deleteMenu(${index})">Buang</button>`;
    if(item.category==="Makanan") foodList.appendChild(li);
    else drinkList.appendChild(li);

    // Customer lists
    const li2 = document.createElement("li");
    li2.innerHTML = `${item.name} - RM${item.price.toFixed(2)} <button onclick="orderItem(${index})">Order</button>`;
    if(item.category==="Makanan") customerFood.appendChild(li2);
    else customerDrink.appendChild(li2);
  });
}

// Order Item (Customer)
function orderItem(index){
  const buyer = document.getElementById("buyerName").value.trim();
  const request = document.getElementById("buyerRequest").value.trim();
  if(!buyer){ alert("Masukkan nama dulu!"); return; }
  const item = menuItems[index];
  orders.push({...item, buyer, request, status:"pending"});
  displayOrders(); displayAllOrders(); displayNewOrders(); displayCustomerInbox();
}

// Display Customer Orders
function displayOrders(){
  const buyer = document.getElementById("buyerName").value.trim();
  const orderList = document.getElementById("orderList");
  const totalPrice = document.getElementById("totalPrice");
  let total = 0;
  orderList.innerHTML="";
  orders.filter(o=>o.buyer===buyer).forEach(order=>{
    const li = document.createElement("li");
    li.textContent = `${order.name} - RM${order.price.toFixed(2)} (${order.request||"Tiada request"}) - ${order.status}`;
    orderList.appendChild(li);
    total+=order.price;
  });
  totalPrice.textContent = total.toFixed(2);
}

// Display All Orders (Admin)
function displayAllOrders(){
  const allOrders = document.getElementById("allOrders");
  allOrders.innerHTML="";
  orders.forEach((order,index)=>{
    const li = document.createElement("li");
    li.innerHTML = `${order.buyer} → ${order.name} - RM${order.price.toFixed(2)} (${order.request||"Tiada request"}) - ${order.status} <input type="checkbox" onclick="markReady(${index})">`;
    allOrders.appendChild(li);
  });
}

// Display New Orders Inbox (Admin)
function displayNewOrders(){
  const newFoodOrders = document.getElementById("newFoodOrders");
  const newDrinkOrders = document.getElementById("newDrinkOrders");
  newFoodOrders.innerHTML=""; newDrinkOrders.innerHTML="";
  orders.filter(o=>o.status==="pending").forEach(order=>{
    const li = document.createElement("li");
    li.textContent = `${order.buyer} → ${order.name}`;
    if(order.category==="Makanan") newFoodOrders.appendChild(li);
    else newDrinkOrders.appendChild(li);
  });
}

// Mark Order Ready
function markReady(index){
  const confirmReady = confirm("Betul ke pesanan ini sudah siap?");
  if(confirmReady){
    orders[index].status = "ready";
    displayAllOrders(); displayNewOrders(); displayCustomerInbox();
    alert(`Notifikasi: ${orders[index].buyer}, pesanan ${orders[index].name} sudah siap!`);
  } else { displayAllOrders(); }
}

// Customer Inbox
function displayCustomerInbox(){
  const inbox = document.getElementById("customerInbox");
  const buyer = document.getElementById("buyerName").value.trim();
  inbox.innerHTML="";
  orders.filter(o=>o.buyer===buyer && o.status==="ready").forEach(order=>{
    const li = document.createElement("li");
    li.textContent = `Pesanan ${order.name} sudah siap!`;
    inbox.appendChild(li);
  });
}

// Logout
function logout(){
  userRole = null;
  document.getElementById("loginPage").classList.remove("hidden");
  document.getElementById("adminPage").classList.add("hidden");
  document.getElementById("customerPage").classList.add("hidden");
}