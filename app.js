const $=id=>document.getElementById(id);
const KEY="aag_business_data_v12";
let state=(()=>{try{return JSON.parse(localStorage.getItem(KEY))||{products:[],sales:[],expenses:[],customers:[],debts:[]}}catch(e){return{products:[],sales:[],expenses:[],customers:[],debts:[]}}})();
const money=n=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(n)||0);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function render(){
 $("productRows").innerHTML=state.products.map(x=>`<tr><td>${esc(x.name)}</td><td>${money(x.price)}</td><td>${esc(x.stock)}</td></tr>`).join("")||"<tr><td colspan=3>No products yet.</td></tr>";
 $("salesRows").innerHTML=state.sales.map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.item)}</td><td>${money(x.amount)}</td></tr>`).join("")||"<tr><td colspan=3>No sales yet.</td></tr>";
 $("expenseRows").innerHTML=state.expenses.map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.desc)}</td><td>${money(x.amount)}</td></tr>`).join("")||"<tr><td colspan=3>No expenses yet.</td></tr>";
 $("customerRows").innerHTML=state.customers.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.phone)}</td></tr>`).join("")||"<tr><td colspan=2>No customers yet.</td></tr>";
 $("debtRows").innerHTML=state.debts.map(x=>`<tr><td>${esc(x.name)}</td><td>${money(x.amount)}</td></tr>`).join("")||"<tr><td colspan=2>No debts yet.</td></tr>";
 let s=state.sales.reduce((a,x)=>a+Number(x.amount||0),0),e=state.expenses.reduce((a,x)=>a+Number(x.amount||0),0),d=state.debts.reduce((a,x)=>a+Number(x.amount||0),0);
 $("salesTotal").textContent=$("rSales").textContent=money(s);$("expenseTotal").textContent=$("rExp").textContent=money(e);$("profitTotal").textContent=$("rProfit").textContent=money(s-e);$("debtTotal").textContent=$("rDebt").textContent=money(d);
}
function close(){ $("modal").classList.remove("show") }
function form(title,fields,done){$("modalTitle").textContent=title;$("form").innerHTML=fields.map(f=>`<label>${f.label}</label><input name="${f.name}" type="${f.type||"text"} required>`).join("")+'<button class="primary">Save</button>';$("modal").classList.add("show");$("form").onsubmit=e=>{e.preventDefault();done(Object.fromEntries(new FormData(e.target)));save();render();close()}}
$("close").onclick=close;
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.page).classList.add("active");$("title").textContent=b.querySelector("span").textContent});
$("addProduct").onclick=()=>form("Add Product",[{label:"Product name",name:"name"},{label:"Price (₦)",name:"price",type:"number"},{label:"Stock",name:"stock",type:"number"}],x=>state.products.push(x));
function sale(){form("Record Sale",[{label:"Item",name:"item"},{label:"Amount (₦)",name:"amount",type:"number"}],x=>state.sales.push({...x,date:new Date().toLocaleDateString("en-NG")}))}
$("addSale").onclick=sale;$("quick").onclick=sale;
$("addExpense").onclick=()=>form("Add Expense",[{label:"Description",name:"desc"},{label:"Amount (₦)",name:"amount",type:"number"}],x=>state.expenses.push({...x,date:new Date().toLocaleDateString("en-NG")}));
$("addCustomer").onclick=()=>form("Add Customer",[{label:"Customer name",name:"name"},{label:"Phone",name:"phone"}],x=>state.customers.push(x));
$("addDebt").onclick=()=>form("Add Debt",[{label:"Customer name",name:"name"},{label:"Amount (₦)",name:"amount",type:"number"}],x=>state.debts.push(x));
render();