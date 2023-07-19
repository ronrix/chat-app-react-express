import { Avatar, Button, Spinner } from "@material-tailwind/react";
import AsyncSelect from "react-select/async";
import useInvitesForm from "../../../../hooks/chat-composer/useInvitesForm";

// react-select custom component
const Component = (props: any) => {
  const { innerProps, innerRef } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className='flex items-center gap-3 px-5 mb-2 hover:bg-gray-100'
    >
      <Avatar
        src={import.meta.env.VITE_BACKEND_URL + "/" + props.value.avatar}
        alt={`${props.label} avatar`}
        size='sm'
        withBorder={true}
        color='blue'
      />
      <span className='sub'>{props.label}</span>
    </div>
  );
};

export default function Invites() {
  const {
    loading,
    people,
    handleSubmitInvites,
    handleChangeSelect,
    promiseOptions,
  } = useInvitesForm();

  return (
    <div>
      {/* TODO: display users to invite */}
      {loading ? (
        <Spinner className='mx-auto mt-10' />
      ) : (
        <form onSubmit={handleSubmitInvites}>
          <AsyncSelect
            cacheOptions={true}
            onChange={handleChangeSelect}
            components={{ Option: Component }}
            defaultOptions={people}
            loadOptions={promiseOptions}
            isMulti
            name='people'
            className='capitalize'
            classNamePrefix='select people'
          />
          <Button
            type='submit'
            variant='gradient'
            size='sm'
            className='ml-auto mr-0 block mt-3'
          >
            Invite
          </Button>
        </form>
      )}
    </div>
  );
}
