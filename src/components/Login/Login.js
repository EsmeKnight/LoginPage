import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../Input/Input";
import AuthContext from "../../context/auth-context";

//state is refering to emailState
// action is referring to changeHandler
function emailReducer(state, action) {
  if (action.type === "USER_EMAIL_INPUT") {
    return { value: action.value, isValid: action.value.includes("@") };
  }
  if (action.type === "EMAIL_INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
}
function passwordReducer(state, action) {
  if (action.type === "USER_PASSWORD_INPUT") {
    return { value: action.value, isValid: action.value.trim().length > 6 };
  }
  if (action.type === "PASSWORD_INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const context = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    console.log("Effect running");

    return () => {
      console.log("Effect cleanup");
    };
  }, []);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("Cleanup");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_EMAIL_INPUT", value: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: "USER_PASSWORD_INPUT",
      value: event.target.value,
    });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "EMAIL_INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "PASSWORD_INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      context.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.activate();
    } else {
      passwordInputRef.current.activate();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          label="E-mail"
          type="email"
          id="email"
          isValid={emailState.isValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          label="Password"
          type="password"
          id="password"
          isValid={passwordState.isValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
