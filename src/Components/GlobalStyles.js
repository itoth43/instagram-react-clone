import { createGlobalStyle} from "styled-components"
export const GlobalStyles = createGlobalStyle`
  .app {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    //font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
  }

  .app__header {
    background-color: ${({ theme }) => theme.body};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }

  .app__posts {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
   }

  .post {
    background-color: ${({ theme }) => theme.body};
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }

  .post__image {
    border-top: 1px solid ${({ theme }) => theme.border};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    transition: all 0.50s linear;
}

  .post__comment-box {
    border-top: 1px solid ${({ theme }) => theme.border};
    transition: all 0.50s linear;
  }

  .post__input {
    border-top: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }

  .post__button {
    border-top: 1px solid ${({ theme }) => theme.border};
    transition: all 0.50s linear;
  }

  .app__theme-toggle-logout {
    background-color: ${({ theme }) => theme.background};
    transition: all 0.50s linear;
   }

   .app__theme-toggle-login {
    background-color: ${({ theme }) => theme.background};
    transition: all 0.50s linear;
   }

  .app__stories {
    background-color: ${({ theme }) => theme.body};
    border: 1px solid ${({ theme }) => theme.border};
    transition: all 0.50s linear;
  }

  .app__button-login {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }

  .app__button-logout {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }
  `