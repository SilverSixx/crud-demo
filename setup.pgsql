create table users(
  id serial PRIMARY KEY,
  user_name varchar(50),
  user_password varchar(255),
  user_role varchar(10)
)