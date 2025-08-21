'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { LoginRequest } from '@/domain/models/auth/request/login-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { useUser } from '@/presentation/hooks/use-user';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z as zod } from 'zod';

import { paths } from '@/paths';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

// const defaultValues = { email: 'admin', password: 'admin123' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();

  const { signInUseCase, userUsecase } = useDI();

  const { checkSession } = useUser();

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        const loginReq = new LoginRequest(values.email, values.password);
        const result = await signInUseCase.execute(loginReq);

        await checkSession?.();

        const user = await userUsecase.getUserInfo();

        StoreLocalManager.saveLocalData(AppStrings.USER_DATA, user);

        if (result.token.trim().length > 0) {
          router.refresh();
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error has occurred.';
        setError('root', { type: 'server', message: message ?? 'Sign in failed' });
      } finally {
        setIsPending(false);
      }
    },
    [checkSession, router, setError, signInUseCase]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">{t('signIn')}</Typography>
        {/* <Typography color="text.secondary" variant="body2">
          {t('dontHaveAnAccount')}{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            {t('signUp')}
          </Link>
        </Typography> */}
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl>
                <InputLabel> {t('username')}</InputLabel>
                <OutlinedInput {...field} label={t('username')} />
                {/* {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null} */}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>{t('password')}</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label={t('password')}
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {/* <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              {t('forgotPassword')}
            </Link>
          </div> */}
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            {t('signIn')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
