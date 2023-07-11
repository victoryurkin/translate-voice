import { UserIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';

export const Login = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="bg-gradient-to-t from-primary-600 to-primary-500 h-1/3 rounded-b-4xl" />
        <div className="flex flex-col justify-center pt-mega">
          <UserIcon className="h-20 fill-primary-600" />
          <div className="flex justify-center py-3xl px-lg">
            <form className="flex-1 max-w-xs md:max-w-md">
              <div className="mb-lg">
                <Input label="Email" type="email" id="email" placeholder="Email" />
              </div>
              <div className="mb-4xl">
                <Input label="Password" type="password" id="password" placeholder="Password" />
              </div>
              <div className="text-center mb-lg">
                <Button className="w-full">Log In</Button>
              </div>
              <div className="text-center">
                <Button className="w-full" type="link">
                  Forgot password?
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <button className="transition-all w-full px-xl pt-2xl py-4xl bg-gradient-to-b from-primary-600 to-primary-500 rounded-t-4xl text-white underline active:from-primary-700 active:to-primary-500 focus-visible:outline-0 focus-visible:shadow-[0px_0px_0px_4px] focus-visible:shadow-primary-300">
        Create an account
      </button>
    </div>
  );
};
