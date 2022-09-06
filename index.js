customerHeaders = [
    {
        key: 'id',
        default: true,
        defaultValue: Date.now()
    },
    {
        key: 'name',
        default: false
    },
    {
        key: 'initialBalance',
        default: false
    },
    {
        key: 'balance',
        default: true,
        defaultValue: 0
    },
    {
        key: 'operations',
        default: true,
        defaultValue: []
    },
]
customers = getLocalStorageItem('customers');

////////////////////////
function getLocalStorageItem(item, dataType = 'array') {
    let myItem;
    try{
        myItem = JSON.parse(localStorage.getItem(item)) || [];
        if(dataType === 'array' && !myItem.length) throw new Error(`The ${item} should be an array!`);
    } catch(error) {
        console.log(error.message);
        myItem = [];
    }
    return myItem;
}
function insertInLocalStorage(name, data) {
    try {
        localStorage.setItem(name, JSON.stringify(data));
    } catch(error) {
        console.log(error.message);
    }
}
const createMyElement = (tag, parent, innerText = null, classes = null) => {
    const myElement = document.createElement(tag);
    myElement.innerHTML = innerText;
    myElement.classList = classes;
    parent.append(myElement);
    return myElement;
}
const drawCustomer = (tag, parent, inner = null, headers = [], customer = null, classes = null) => {
    headers.forEach(head => {
        let innerText = '';
        if (head.key !== 'operations') {
        
            if (inner === 'customersDraw') {
                innerText = `${customer[head.key]}`;
            } else if (inner === 'customerShow') {
                innerText = `${head.key}: ${customer[head.key]}`;
            }
            
            createMyElement(tag, parent, innerText, classes);
        }
    });
}

const changeWithdraw = (value, index, type) => {
    customers[index].operations.push({
        operationType: type,
        value
    });
    value = type === 'add'? value : value * -1;
    customers[index].balance = Number(customers[index].balance) + Number(value);
    insertInLocalStorage('customers', customers);
    drawCustomers(customers);
}
const doOperation = (i, type) => {
    const condition = type === 'add'? 5000 : customers[i].balance;
    let value = Number(prompt('Please, insert a Balance!'));
    if (value < 0){
        alert('Please, Insert a valid value.')
    } else if (value > condition) {
        alert(`Please, insert a value less than ${condition}`);
    } else {
        changeWithdraw(value, i, type);
}}

const visitCustomer = (customer) => {
    insertInLocalStorage('customer', customer);
    document.location.href = 'single.html';
}
const drawCustomers = (customers) => {
    customersContainer.innerHTML = '';
    console.log(customers);
    if (!customers.length) {
        let tr = createMyElement("tr", customersContainer);
        const td = createMyElement("td", tr, "There isn't any data yet", 'text-center alert alert-danger')
        td.colSpan = '6';
    }
    customers.forEach((customer, i) => {
        const tr = createMyElement('tr', customersContainer)
        drawCustomer('td', tr, 'customersDraw', customerHeaders, customer)
        const td = createMyElement("td", tr)
        const addBtn = createMyElement("button", td, "Add", "btn btn-primary mx-2")
        addBtn.addEventListener("click", () => {doOperation(i, 'add')})
        
        const withdrawBtn = createMyElement("button", td, "Withdraw", "btn btn-danger mx-2")
        withdrawBtn.addEventListener("click", () => {doOperation(i, 'withdraw')})
          
        


        const allBalBtn = createMyElement("button", td, "All Operations", "btn btn-success mx-2")
        allBalBtn.addEventListener('click', () => visitCustomer(customer))
        
        
    })
}

////////////////////////

// Home Page //
const customersContainer = document.querySelector('#customersContainer');
if (customersContainer) {
    drawCustomers(customers);
}
////////////////////////
// Add page //

const addForm = document.querySelector('#addForm');
if (addForm) {
    addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const target = event.target.elements;
        const customer = {}
        customerHeaders.forEach(head => {
            if (head.default) {
                if (head.key === 'balance') {
                    customer[head.key] = Number(target.initialBalance.value);
                } else {
                    customer[head.key] = head.defaultValue;
                }
            } else {
                customer[head.key] = target[head.key].value;
            }
        })
        customers.push(customer);
        insertInLocalStorage('customers', customers);
        document.location.href = 'index.html';
})
}

//////////////////////////
// Single Page //
const operationsContainer = document.querySelector('#operationsContainer');
const customer = getLocalStorageItem('customer', 'object');
if (operationsContainer) {
    console.log(customer)
    customerHeaders.forEach(head => {
        if (head.key === 'operations') {
            const operations = customer[head.key];
            operations.forEach(operation => {
                const keys = ['operationType', 'value']
                const tr = createMyElement('tr', operationsContainer);
                keys.forEach(key => {
                    const td = createMyElement('td', tr, operation[key]);
                })
            })
        } else {
            const ele = document.querySelector(`#${head.key}`);
            ele.innerHTML = customer[head.key];

        }
    }
    )
}