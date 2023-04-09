import React, { FC, useState } from "react";
import { Stack, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import Button from "@components/shared/Button";
import SettingsSection from "@components/settings/SettingsSection";
import { useAuth } from "@util/auth/hooks";
import { useForm } from "react-hook-form";
import AuthAPI from "@util/auth/api";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import errors from "@util/errors";

export interface ProfileInfoSectionProps {
}

type FormData = {
    displayName: string;
    pronouns: string;
    meetingLink: string;
    phoneNumber: string;
    phoneCountryCode: string;
    phoneIsValid: boolean;
};

const StyledPhoneInput = styled(PhoneInput)(({ theme }) => ({
    '& .phone-container': {
        maxWidth: '100%',
    },

    '& .phone-input': {
        maxWidth: '100%',
        background: theme.palette.background.paper,
        borderColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
        color: theme.palette.text.primary,
        height: 40,
        '&:hover': {
            borderColor: theme.palette.text.primary,
        },
        '&:focus': {
            borderColor: theme.palette.primary.main,
        },
    },

    '& .dropdown-button': {
        background: theme.palette.background.paper,
        borderColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
        '&:hover': {
            borderColor: theme.palette.background.paper,
        },

        '& .selected-flag': {
            background: theme.palette.background.paper,
            '&:hover, &:focus': {
                background: theme.palette.mode === 'light' ? '#f1f1f1' : '#333',
                borderColor: theme.palette.primary.main,
            },
        },
        '& .country-list .country.highlight': {
            background: theme.palette.mode === 'light' ? '#f1f1f1' : '#333',
            '& .selected-flag': {
                background: theme.palette.mode === 'light' ? '#f1f1f1' : '#333',
            }
        },
    },

    '& .dropdown-menu': {
        background: theme.palette.background.paper,
        '&:hover': {
            background: theme.palette.background.paper,
        },
        '& .selected:hover': {
            background: theme.palette.background.paper,
        },

        '& .country': {
            background: theme.palette.background.paper,
            '&:hover, & .highlight': {
                background: theme.palette.mode === 'light' ? '#f1f1f1' : '#333',
            },
        },
    },

    '& .search-field': {
        background: theme.palette.background.paper,

    },

    '& .flag-dropdown.open .selected-flag': {
        background: `${theme.palette.background.paper} !important`,
    },


}));

const ProfileInfoSection: FC<ProfileInfoSectionProps> = ({ }) => {
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const isTA = currentUser && Object.keys(currentUser.coursePermissions).length > 0;

    const { register, handleSubmit, formState: { errors: formErrors }, setValue } = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        setLoading(true);
        if (data.phoneNumber != "" && data.phoneIsValid != undefined && !data.phoneIsValid) {
            toast.error("Invalid phone number format");
            setLoading(false);
            return;
        } else {
            toast.promise(AuthAPI.updateUser(data.displayName, data.pronouns, data.meetingLink, data.phoneNumber, data.phoneCountryCode), {
                loading: "Updating user profile...",
                success: "User profile updated",
                error: errors.UNKNOWN,
            })
                .then(() => {
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    });

    return <SettingsSection title="Your profile">
        <form onSubmit={onSubmit}>
            <Stack spacing={3} mt={4}>
                <TextField size="small" label="Name" {...register("displayName")}
                    defaultValue={currentUser?.displayName}
                    required />
                <TextField size="small" label="Email" disabled value={currentUser?.email} />
                <TextField size="small" label="Pronouns" {...register("pronouns")}
                    defaultValue={currentUser?.pronouns} />
                {isTA && <TextField size="small" label="Zoom link" {...register("meetingLink")}
                    defaultValue={currentUser?.meetingLink} type="url" />}
                <StyledPhoneInput
                    country={'us'}
                    containerClass={'phone-container'}
                    inputClass={'phone-input'}
                    buttonClass={'dropdown-button'}
                    dropdownClass={'dropdown-menu'}
                    searchClass={'search-field'}
                    placeholder={"Enter phone number"}
                    value={currentUser?.phoneNumber}
                    onChange={(value, country: any, e, formattedValue) => {
                        const { format, dialCode, countryCode } = country;
                        if (format?.length === formattedValue?.length && (value.startsWith(dialCode) || dialCode.startsWith(value))) {
                            setValue("phoneIsValid", true);
                        } else {
                            setValue("phoneIsValid", false);
                        }
                        setValue("phoneNumber", value);
                        setValue("phoneCountryCode", countryCode);
                    }}
                />
                <Stack direction="row" justifyContent="end">
                    <Button variant="contained" type="submit" loading={loading}>
                        Save
                    </Button>
                </Stack>
            </Stack>
        </form>
    </SettingsSection>;
};

export default ProfileInfoSection;


