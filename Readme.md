### register-api : `POST /api/v1/register`

add new user

- error when email is duplicate :

```javascript
{
  "msg": {
    "message": "duplicate email : 1@gmail.com",
    "param": "email"
  }
}
```

- error when params are missing :

```javascript
{
  "msg": [
    {
      "message": "no email found",
      "param": "email"
    },
    {
      "message": "no role found",
      "param": "role"
    }
  ]
}
```
