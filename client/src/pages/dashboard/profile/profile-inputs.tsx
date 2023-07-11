import { useAuthUser } from "react-auth-kit";
import InputField from "./input-field";

type Props = {
  handleOnChangeFields: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileInputs(props: Props) {
  const auth = useAuthUser();
  const { handleOnChangeFields } = props;
  return (
    <section>
      <div>
        <InputField
          type='text'
          name='username'
          placeholder='usernmae'
          label='name'
          note='Your name will be your identity from other users.'
          handleOnChangeFields={handleOnChangeFields}
          defaultValue={auth()?.username}
        />
        <InputField
          type='email'
          name='email'
          placeholder='email'
          label='email'
          note='
            Your email will be your login credential, you will use this to login
            your account.
          '
          handleOnChangeFields={handleOnChangeFields}
          defaultValue={auth()?.email}
        />
        <InputField
          type='password'
          name='password'
          placeholder='*****'
          label='password'
          note='
            Note: remember your password before clicking the update button
          '
          handleOnChangeFields={handleOnChangeFields}
          defaultValue={auth()?.username}
        />
      </div>
    </section>
  );
}
