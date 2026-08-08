const KEY="aag_business_v11_data";
const empty={products:[],sales:[],expenses:[],customers:[],debts:[]};
let state=load();

function load(){
  try{
    const raw=localStorage.getItem(KEY);
    return raw ? {...empty,...JSON.parse(raw)} : structuredClone(empty);
  }catch(e){ return structuredClone(empty); }
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function money(v){return new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(v)||0);}
function today(){return new Date().toLocaleDateString("en-NG");}

function render(){
  $("productRows").innerHTML=state.products.length?state.products.map(x=>`<tr><td>${esc(x.name)}</td><td>${money(x.price)}</td><td>${esc(x.stock)}</td></tr>`).join(""):`<tr><td colspan="3">No products yet.</td></tr>`;
  $("salesRows").innerHTML=state.sales.length?state.sales.map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.item)}</td><td>${money(x.amount)}</td></tr>`).join(""):`<tr><td colspan="3">No sales yet.</td></tr>`;
  $("expenseRows").innerHTML=state.expenses.length?state.expenses.map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.desc)}</td><td>${money(x.amount)}</td></tr>`).join(""):`<tr><td colspan="3">No expenses yet.</td></tr>`;
  $("customerRows").innerHTML=state.customers.length?state.customers.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.phone)}</td></tr>`).join(""):`<tr><td colspan="2">No customers yet.</td></tr>`;
  $("debtRows").innerHTML=state.debts.length?state.debts.map(x=>`<tr><td>${esc(x.name)}</td><td>${money(x.amount)}</td></tr>`).join(""):`<tr><td colspan="2">No debts yet.</td></tr>`;

  const sales=state.sales.reduce((t,x)=>t+Number(x.amount||0),0);
  const exp=state.expenses.reduce((t,x)=>t+Number(x.amount||0),0);
  const debt=state.debts.reduce((t,x)=>t+Number(x.amount||0),0);
  $("dashSales").textContent=$("repSales").textContent=money(sales);
  $("dashExpenses").textContent=$("repExpenses").textContent=money(exp);
  $("dashProfit").textContent=$("repProfit").textContent=money(sales-exp);
  $("dashDebt").textContent=$("repDebt").textContent=money(debt);
}

function openModal(title,fields,onSave){
  $("modalTitle").textContent=title;
  $("modalForm").innerHTML=fields.map(f=>`<label for="${f.name}">${f.label}</label><input id="${f.name}" name="${f.name}" type="${f.type||"text"} ${f.min!==undefined?`min="${f.min}"`:""} required>`).join("")+
    `<button type="submit" class="primary">Save</button>`;
  $("modal").classList.add("show");
  $("modal").setAttribute("aria-hidden","false");
  setTimeout(()=>document.querySelector("#modalForm input")?.focus(),50);
  $("modalForm").onsubmit=e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.currentTarget).entries());
    onSave(data);
    save();
    render();
    closeModal();
  };
}
function closeModal(){$("modal").classList.remove("show");$("modal").setAttribute("aria-hidden","true");}
$("closeModal").onclick=closeModal;
$("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal();});

document.querySelectorAll(".nav").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  $(btn.dataset.page).classList.add("active");
  $("pageTitle").textContent=btn.querySelector("span").textContent;
}));

$("addProduct").onclick=()=>openModal("Add Product",[
  {label:"Product name",name:"name"},
  {label:"Selling price (₦)",name:"price",type:"number",min:0},
  {label:"Stock quantity",name:"stock",type:"number",min:0}
],x=>state.products.push(x));

function newSale(){openModal("Record Sale",[
  {label:"Item",name:"item"},
  {label:"Amount (₦)",name:"amount",type:"number",min:0}
],x=>state.sales.push({...x,date:today()}));}
$("addSale").onclick=newSale;
$("quickSale").onclick=newSale;

$("addExpense").onclick=()=>openModal("Add Expense",[
  {label:"Description",name:"desc"},
  {label:"Amount (₦)",name:"amount",type:"number",min:0}
],x=>state.expenses.push({...x,date:today()}));

$("addCustomer").onclick=()=>openModal("Add Customer",[
  {label:"Customer name",name:"name"},
  {label:"Phone",name:"phone"}
],x=>state.customers.push(x));

$("addDebt").onclick=()=>openModal("Add Debt",[
  {label:"Customer name",name:"name"},
  {label:"Amount (₦)",name:"amount",type:"number",min:0}
],x=>state.debts.push(x));

render();
