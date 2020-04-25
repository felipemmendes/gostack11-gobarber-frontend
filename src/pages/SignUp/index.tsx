// dependencies imports
import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

// functions imports
import getValidationErrors from '../../utils/getValidationsErrors';

// components imports
import { Container, Content, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

// assets imports
import logoImg from '../../assets/logo.svg';

interface SignUpFormData {
  signUpName: string;
  signUpEmail: string;
  signUpPassword: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          signUpName: Yup.string().required('Digite seu nome completo'),
          signUpEmail: Yup.string()
            .required('Digite seu e-mail')
            .email('Digite um e-mail válido'),
          signUpPassword: Yup.string().min(
            6,
            'Digite uma senha com no mínimo 6 caracteres',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', {
          name: data.signUpName,
          email: data.signUpEmail,
          password: data.signUpPassword,
        });

        addToast({
          type: 'success',
          title: 'Cadastro realizado com sucesso',
          description: 'Você já pode fazer seu logon no GoBarber',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro no cadastro',
            description:
              'Ocorreu um erro ao realizar o cadastro, cheque as credenciais',
          });
        }
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />

      <Content>
        <img src={logoImg} alt="BoGarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input
            name="signUpName"
            id="signUpName"
            icon={FiUser}
            type="text"
            placeholder="Nome"
          />

          <Input
            name="signUpEmail"
            id="signUpEmail"
            icon={FiMail}
            type="text"
            placeholder="E-mail"
          />

          <Input
            name="signUpPassword"
            id="signUpPassword"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft />
          Voltar para logon
        </Link>
      </Content>
    </Container>
  );
};

export default SignUp;
