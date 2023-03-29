const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employees'
});

// function to start the application
async function start() {
  console.log('Welcome to the Employee Management System!');

  // prompt the user to choose an action
  const action = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  });

  // call the appropriate function based on the user's choice
  switch (action.action) {
    case 'View all departments':
      await viewAllDepartments();
      break;
    case 'View all roles':
      await viewAllRoles();
      break;
    case 'View all employees':
      await viewAllEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      connection.end();
      return;
  }

  // start the application again
  start();
}

// function to view all departments
async function viewAllDepartments() {
  // execute the query to get all departments
  const [rows, fields] = await connection.execute('SELECT * FROM departments');

  // display the departments in a table
  console.table(rows);
}

// function to view all roles
async function viewAllRoles() {
  // execute the query to get all roles with their respective departments
  const [rows, fields] = await connection.query(`
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
  `);

  // display the roles in a table
  console.table(rows);
}

// function to view all employees
async function viewAllEmployees() {
  // execute the query to get all employees with their respective roles and departments
  const [rows, fields] = await connection.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id
  `);

  // display the employees in a table
  console.table(rows);
}

// function to add a department
async function addDepartment() {
  // prompt the user to enter the name of the department
  const { name } = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'What is the name of the department?'
  });

  // execute the query to add the department to the database
  await connection.query('INSERT INTO departments (name) VALUES (?)', [name]);

  console.log(`Department '${name}' added successfully!`);
}

// function to add a role
async function addRole() {
  // prompt the user to enter the details of the new role
  const { title, salary, department_id } = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the title of the new role?'
    },
    {
      name: 'salary',
      type: 'number',
      message: 'What is the salary of the new role?'
    },
    {
      name: 'department_id',
      type: 'number',
      message: 'What is the department ID of the new role?'
    }
  ]);

  // execute the query to add the role to the database
  await connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department_id]);

  console.log("Role '${title}' added successfully!");
}

// function to add an employee
async function addEmployee() {
  // prompt the user to enter the details of the new employee
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: "What is the new employee's first name?"
    },
    {
      name: 'last_name',
      type: 'input',
      message: "What is the new employee's last name?"
    },
    {
      name: 'role_id',
      type: 'number',
      message: "What is the new employee's role ID?"
    },
    {
      name: 'manager_id',
      type: 'number',
      message: "What is the new employee's manager's ID? (leave blank if the employee has no manager)"
    }
  ]);

  // execute the query to add the employee to the database
  await connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, role_id, manager_id]);

  console.log("Employee '${first_name} ${last_name}' added successfully!");
}

// function to update an employee's role
async function updateEmployeeRole() {
  // prompt the user to select an employee to update
  const [employees, fields] = await connection.query('SELECT * FROM employees');
  const employeeChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));


const { employee_id } = await inquirer.prompt({
  name: 'employee_id',
  type: 'list',
  message: 'Which employee would you like to update?',
  choices: employeeChoices
});

// prompt the user to select a new role for the employee
const [roles, fields2] = await connection.query('SELECT * FROM roles');
const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

const { role_id } = await inquirer.prompt({
  name: 'role_id',
  type: 'list',
  message: 'Which role would you like to assign to the employee?',
  choices: roleChoices
});

// execute the query to update the employee's role
await connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [role_id, employee_id]);

console.log("Employee's role updated successfully!");
};

// connect to the database and start the application
(async () => {
  try {
    await connection;
    console.log('Connected to the MySQL database!');
    start();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();
