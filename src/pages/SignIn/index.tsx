// dependencies imports
import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

// custom hooks imports
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

// functions imports
import getValidationErrors from '../../utils/getValidationsErrors';

// components imports
import { Container, Content, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

// assets imports
import logoImg from '../../assets/logo.svg';

// interfaces
interface SignInFormData {
  signInEmail: string;
  signInPassword: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          signInEmail: Yup.string()
            .required('Digite seu e-mail')
            .email('Digite um e-mail válido'),
          signInPassword: Yup.string().required('Digite sua senha'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.signInEmail,
          password: data.signInPassword,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro na autenticação',
            description:
              'Ocorreu um erro ao realizar o login, cheque as credenciais',
          });
        }
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="BoGarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>

          <Input
            name="signInEmail"
            id="signInEmail"
            icon={FiMail}
            type="email"
            placeholder="E-mail"
          />

          <Input
            name="signInPassword"
            id="signInPassword"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Entrar</Button>

          <a href="forgot">Esqueci minha senha</a>
        </Form>

        <Link to="/signup">
          <FiLogIn />
          Criar conta
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
