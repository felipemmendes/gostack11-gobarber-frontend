import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FiLock } from 'react-icons/fi';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationsErrors';

import { Container, Content, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';

interface ResetPasswordFormData {
  new_password: string;
  confirm_password: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { search } = useLocation();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          new_password: Yup.string()
            .min(6, 'Digite uma senha com no mínimo 6 caracteres')
            .required('Digite uma nova senha'),
          confirm_password: Yup.string()
            .oneOf([Yup.ref('new_password'), null], 'Senhas não são iguais')
            .required('Digite sua senha'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password: data.new_password,
          password_confirmation: data.confirm_password,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao resetar senha',
            description: 'Ocorreu um erro ao resetar a senha. Tente novamente.',
          });
        }
      }
    },
    [addToast, search, history],
  );

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="BoGarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Resetar senha</h1>

          <Input
            name="new_password"
            id="new_password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />

          <Input
            name="confirm_password"
            id="confirm_password"
            icon={FiLock}
            type="password"
            placeholder="Confirmação de Senha"
          />

          <Button type="submit">Alterar senha</Button>
        </Form>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
