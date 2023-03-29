USE employees;

INSERT INTO department (name)
VALUES
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
    ('Engineering Assistant', 600000, 1),
    ('Project Manager', 80000, 1),
    ('Lead Engineer', 150000, 1),
    ('Finance Manager', 100000, 2),
    ('Accountant', 120000, 2),
    ('Attorney', 125000, 3),
    ('Secretary', 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Joe', 'Joeson', 3, NULL),
    ('Kyle', 'Roff', 1, 1),
    ('Dave', 'Rose', 6, NULL),
    ('Kevin', 'Ferguson', 7, 3),
    ('Andrew', 'Brown', 5, NULL),
    ('Malia', 'Brown', 4, 5),
    ('Jim', 'Laheigh', 2, 1);