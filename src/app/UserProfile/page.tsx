'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ensureAuthenticated } from '@/lib/auth';
import { getUserProfile, updateUserProfile } from '../api/user';
import HomeIconNavigation from '@/components/HomeIconNavigation';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    oldPassword: '',
    dob: '',
  });
  const [error, setError] = useState('');
  const [highlight, setHighlight] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [phonePrompt, setPhonePrompt] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { token, userId } = ensureAuthenticated();
        const profile = await getUserProfile(userId, token);
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phone: profile.phone || profile.phoneNumber || '',
          password: '',
          confirmPassword: '',
          oldPassword: '',
          dob: profile.dob || '',
        });
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        alert(err.message);
      }
    };
    loadProfile();
  }, []);

  const router = useRouter();

  const resetOldPasswordField = () => {
    setFormData((prev) => ({ ...prev, oldPassword: '' }));
    setHighlight((prev) => ({ ...prev, oldPassword: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Phone number: only allow digits
    if (id === 'phone') {
      if (/\D/.test(value)) {
        setError('');
        setPhonePrompt('Phone number must contain digits only.');
        setHighlight((prev) => ({ ...prev, phone: true }));
        setTimeout(() => {
          setPhonePrompt('');
          setHighlight((prev) => ({ ...prev, phone: false }));
        }, 2000); // Notification stays for 2s
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
    setHighlight((prev) => ({ ...prev, [id]: false }));
    setError('');
  };

  const validateFields = () => {
    const requiredFields = ['firstName', 'lastName', 'phone', 'dob'];
    let hasError = false;
    const newHighlight: { [key: string]: boolean } = {};
    requiredFields.forEach((field) => {
      if (!(formData as any)[field].trim()) {
        newHighlight[field] = true;
        hasError = true;
      }
    });
    if (hasError) {
      setError('Please fill in all required fields.');
      setHighlight((prev) => ({ ...prev, ...newHighlight }));
      setTimeout(() => {
        setHighlight((prev) => {
          const reset: { [key: string]: boolean } = { ...prev };
          requiredFields.forEach((f) => (reset[f] = false));
          return reset;
        });
      }, 1500);
      return false;
    }
    // Phone number digits only check (should not be needed, but double check)
    if (/\D/.test(formData.phone)) {
      setError('Phone number must contain digits only.');
      setHighlight((prev) => ({ ...prev, phone: true }));
      setTimeout(() => {
        setHighlight((prev) => ({ ...prev, phone: false }));
      }, 2000); // Increased duration to 2s
      return false;
    }
    // Password match check
    if (
      (formData.password || formData.confirmPassword) &&
      formData.password !== formData.confirmPassword
    ) {
      setError('New passwords do not match. Please re-type both fields.');
      setHighlight((prev) => ({
        ...prev,
        password: true,
        confirmPassword: true,
      }));
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setTimeout(() => {
        setHighlight((prev) => ({
          ...prev,
          password: false,
          confirmPassword: false,
        }));
      }, 1500); // Increased duration
      return false;
    }
    return true;
  };

  const toggleEdit = async () => {
    if (isEditing) {
      setError('');
      setHighlight({});
      // Validate all fields
      if (!validateFields()) return;
      // Old password required if updating password or any field
      if (
        (formData.password || formData.confirmPassword) &&
        !formData.oldPassword
      ) {
        setError('Please enter your old password to save updates.');
        resetOldPasswordField();
        setTimeout(() => {
          setHighlight((prev) => ({ ...prev, oldPassword: false }));
        }, 800);
        return;
      }
      try {
        const { token, userId } = ensureAuthenticated();
        await updateUserProfile(userId, token, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phone, // changed from phone to phoneNumber
          password: formData.password,
          oldPassword: formData.oldPassword,
          dob: formData.dob,
        });
        setFormData((prev) => ({
          ...prev,
          password: '',
          confirmPassword: '',
          oldPassword: '',
        }));
        setShowSuccessModal(true);
        return; // Don't toggle edit mode yet, wait for user action
      } catch (err: any) {
        // Inspect and parse error if needed
        let msg = err.message || '';
        let parsedErr = err;
        if (typeof err === 'string') {
          try {
            parsedErr = JSON.parse(err);
            msg = parsedErr.message;
          } catch {
            // Not JSON, keep as string
          }
        } else if (
          typeof err === 'object' &&
          err !== null &&
          'code' in err &&
          'message' in err
        ) {
          msg = err.message;
        }
        console.log('Error caught in UserProfile:', err, 'Parsed:', parsedErr);
        if (msg.includes('400')) {
          setError('The old password is incorrect.');
          setHighlight((prev) => ({ ...prev, oldPassword: true }));
          setFormData((prev) => ({ ...prev, oldPassword: '' }));
          setTimeout(() => {
            setHighlight((prev) => ({ ...prev, oldPassword: false }));
          }, 1500);
        } else if (msg === 'Uncategorized error') {
          setError('The old password is incorrect.');
          setHighlight((prev) => ({ ...prev, oldPassword: true }));
          setFormData((prev) => ({ ...prev, oldPassword: '' }));
          setTimeout(() => {
            setHighlight((prev) => ({ ...prev, oldPassword: false }));
          }, 1500);
        } else if (
          msg.includes('1006') ||
          msg.includes('9999') ||
          msg.includes('401') ||
          /old password/i.test(msg)
        ) {
          setError(
            'Old password is incorrect or missing. Please enter the correct old password.'
          );
          resetOldPasswordField();
        } else {
          setError(msg);
        }
        return;
      }
    }
    setIsEditing((prev) => !prev);
  };

  const handleTogglePassword = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Eye icon SVG (user-friendly: open = eye, closed = eye with slash)
  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      // Open eye
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 cursor-pointer text-gray-500 hover:text-[#ff785b]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ) : (
      // Closed eye (eye with slash)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 cursor-pointer text-gray-500 hover:text-[#ff785b]"
      >
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M2.25 12C3.5 7.5 7.5 4.5 12 4.5c2.1 0 4.07.7 5.7 1.9M21.75 12c-.443.982-1.05 2.082-1.832 3.223M15.75 15.75A6.75 6.75 0 0112 18c-4.5 0-8.5-3-9.75-7.5a10.44 10.44 0 012.73-4.777M9.75 9.75a3 3 0 104.5 4.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5"
          />
        </>
      </svg>
    );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#ffe5dc] via-[#fff8f6] to-[#ffe5dc] px-4 py-12">
      {/* Decorative Bubbles */}
      <div className="animate-float-slow absolute -top-10 left-0 size-40 rounded-full bg-[#ffbfae] opacity-30 blur-2xl" />
      <div className="animate-float absolute bottom-0 right-0 size-56 rounded-full bg-[#ff785b] opacity-20 blur-3xl" />
      <div className="animate-float-reverse absolute left-0 top-1/2 size-24 rounded-full bg-[#ffe5dc] opacity-40 blur-xl" />
      <div className="animate-float absolute right-1/3 top-1/4 size-32 rounded-full bg-[#fa9f3d] opacity-20 blur-2xl" />
      <div className="animate-float absolute bottom-1/4 left-1/3 size-24 rounded-full bg-[#9757d7] opacity-10 blur-2xl" />
      <HomeIconNavigation />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#ffbfae] bg-white/90 p-8 shadow-2xl backdrop-blur-md">
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-8 shadow-2xl">
              <div className="mb-4 text-2xl font-bold text-[#16a34a]">
                Profile updated successfully!
              </div>
              <div className="mb-6 text-gray-700">
                Your profile has been updated.
              </div>
              <div className="flex w-full gap-4">
                <Button
                  className="flex-1 bg-[#ff785b] text-white hover:bg-[#ff5b3b]"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setIsEditing(true); // Stay in edit mode
                  }}
                >
                  Continue editing
                </Button>
                <Button
                  className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/');
                  }}
                >
                  Back to home page
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#ff785b] [font-family:'Red_Rose-Bold',Helvetica]">
            Profile
          </h2>
          {isEditing ? (
            <Button
              variant="outline"
              className="rounded-[20px] border-[#ff785b] text-[#ff785b] hover:bg-[#ff785b]/10"
              onClick={() => {
                setIsEditing(false);
                setError('');
                setHighlight({});
                // Optionally reload profile to reset formData
                const { token, userId } = ensureAuthenticated();
                getUserProfile(userId, token).then((profile) => {
                  setFormData({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    phone: profile.phone || profile.phoneNumber || '',
                    password: '',
                    confirmPassword: '',
                    oldPassword: '',
                    dob: profile.dob || '',
                  });
                });
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded-[20px] border-[#ff785b] text-[#ff785b] hover:bg-[#ff785b]/10"
              onClick={toggleEdit}
            >
              Edit
            </Button>
          )}
        </div>
        {error && (
          <div
            className={`animate-shake sticky top-0 z-50 mb-4 animate-pulse rounded border border-red-400 bg-red-200 px-4 py-3 text-base font-bold text-red-800 shadow`}
            style={{ animationDuration: '0.7s' }}
            role="alert"
            aria-live="assertive"
          >
            <span className="mr-2 inline-block align-middle">⚠️</span>
            {error}
          </div>
        )}
        {phonePrompt && (
          <div
            className={
              `mb-2 rounded bg-yellow-100 px-4 py-2 text-xs text-yellow-800 font-semibold animate-pulse ` +
              (phonePrompt ? 'animate-shake' : '')
            }
            style={{ animationDuration: '0.5s' }}
          >
            {phonePrompt}
          </div>
        )}
        {/* User Profile details and Editable Fields merged */}
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {[
            { id: 'firstName', label: 'First Name', type: 'text' },
            { id: 'lastName', label: 'Last Name', type: 'text' },
            { id: 'phone', label: 'Phone Number', type: 'tel' },
            { id: 'dob', label: 'Date of Birth', type: 'date' },
            { id: 'oldPassword', label: 'Old Password', type: 'password' },
            { id: 'password', label: 'New Password', type: 'password' },
            {
              id: 'confirmPassword',
              label: 'Confirm Password',
              type: 'password',
            },
          ].map((field) => (
            <div key={field.id} className="relative">
              <label
                htmlFor={field.id}
                className="mb-2 block text-sm font-semibold text-[#204944]"
              >
                {field.label}
              </label>
              <Input
                id={field.id}
                type={
                  field.type === 'password' && showPassword[String(field.id)]
                    ? 'text'
                    : field.type
                }
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
                onFocus={
                  field.id === 'phone'
                    ? () => {
                        setPhonePrompt('');
                        setHighlight((prev) => ({ ...prev, phone: false }));
                      }
                    : undefined
                }
                readOnly={
                  !isEditing &&
                  field.id !== 'oldPassword' &&
                  field.id !== 'password' &&
                  field.id !== 'confirmPassword'
                }
                className={
                  ['oldPassword', 'password', 'confirmPassword'].includes(
                    field.id
                  )
                    ? `ring-offset-background focus-visible:ring-ring flex h-12 w-full rounded-[33px] border border-[#ff785b] bg-white px-6 py-2 text-sm text-[#333] shadow-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50${highlight[field.id] ? ' animate-shake border-2 border-red-500 ring-2 ring-red-300' : ''} pr-12`
                    : `h-[45px] w-full rounded-[30px] border px-5 text-sm transition-all duration-300${isEditing ? ' border-[#ff785b]' : ' border-gray-300 bg-gray-100'} text-[#444] placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50${highlight[field.id] ? ' animate-shake border-2 border-red-500 ring-2 ring-red-300' : ''}`
                }
                autoComplete={
                  field.id === 'oldPassword' ? 'current-password' : 'off'
                }
                placeholder={
                  field.id === 'oldPassword'
                    ? 'Enter your current password to save changes'
                    : field.id === 'password' || field.id === 'confirmPassword'
                      ? 'Leave blank if not changing password'
                      : field.id === 'phone'
                        ? 'Enter your phone number'
                        : ''
                }
              />
              {/* Eye icon for password fields */}
              {['oldPassword', 'password', 'confirmPassword'].includes(
                field.id
              ) && (
                <span
                  className="absolute right-4 top-1/2 z-10 mt-3.5 -translate-y-1/2"
                  onClick={() => handleTogglePassword(field.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={
                    showPassword[field.id] ? 'Hide password' : 'Show password'
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTogglePassword(field.id);
                    }
                  }}
                >
                  <EyeIcon open={showPassword[field.id]} />
                </span>
              )}
            </div>
          ))}
          {/* Save changes button (replaces View Current Order) */}
          <div className="mt-6 text-center">
            <Button
              onClick={toggleEdit}
              className="w-full rounded-[33px] bg-[#ff785b] px-6 py-2 text-white hover:bg-[#ff5b3b]"
              type="button"
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

/* Add shake animation to global styles if not present */
// In your CSS (e.g., globals.css or tailwind.config.js), add:
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   20%, 60% { transform: translateX(-8px); }
//   40%, 80% { transform: translateX(8px); }
// }
// .animate-shake { animation: shake 0.5s; }
