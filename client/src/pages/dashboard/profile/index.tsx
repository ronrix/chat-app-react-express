import useProfile from "../../../hooks/profile/useProfile";
import SubmitBtn from "./submit-btn";
import ChangeAvatar from "./change-avatar";
import ProfileInputs from "./profile-inputs";

export default function Profile() {
  const { handleOnChangeFields, handleUpdateProfileInfo } = useProfile();

  return (
    <form
      onSubmit={handleUpdateProfileInfo}
      className='p-5 flex flex-col gap-10'
    >
      <section>
        <h2 className='capitalize font-bold text-2xl'>
          Personal profile settings
        </h2>
        <p className=''>You can modify your profile here</p>
      </section>

      <ChangeAvatar />
      <ProfileInputs handleOnChangeFields={handleOnChangeFields} />
      <SubmitBtn />
    </form>
  );
}
