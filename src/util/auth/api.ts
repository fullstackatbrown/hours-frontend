import {
    getAuth,
    GoogleAuthProvider,
    inMemoryPersistence,
    setPersistence,
    signInWithPopup,
} from "firebase/auth";
import APIClient from "@util/APIClient";

const enum Endpoint {
    GET_SESSION = '/users/session',
    ME = '/users/me',
    SIGN_OUT = '/users/signout',
    USER = '/users',
}

export const enum CoursePermission {
    CourseAdmin = "ADMIN",
    CourseStaff = "STAFF"
}

/** A User in the authentication system */
export interface User {
    id: string;
    email: string;
    displayName: string;
    photoUrl: string;
    isAdmin: boolean;
    coursePermissions: Map<string, CoursePermission>
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function getCurrentUser(): Promise<User> {
    try {
        return await APIClient.get(Endpoint.ME);
    } catch (e) {
        throw e;
    }
}

/**
 * Fetches profile information corresponding to the currently logged in user.
 */
async function getUserById(id: string): Promise<User> {
    try {
        return await APIClient.get(`${Endpoint.USER}/${id}`);
    } catch (e) {
        throw e;
    }
}

/**
 * Redirects the user to a Google sign in page, then creates a session with the SMU API.
 */
async function signInWithGoogle() {
    const auth = getAuth();

    // As httpOnly cookies are to be used, do not persist any state client side.
    await setPersistence(auth, inMemoryPersistence);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        'hd': 'brown.edu'
    });

    return signInWithPopup(auth, provider)
        .then((userCredential) => {
            // Signed in
            return userCredential.user.getIdToken(true)
                .then(async (idToken) => {
                    // Session login endpoint is queried and the session cookie is set.
                    // TODO: CSRF protection should be taken into account.
                    return await APIClient.post(Endpoint.GET_SESSION, {token: idToken.toString()});
                });
        })
        .catch(() => {
            throw Error("Invalid credentials");
        });
}

/**
 * Signs out the current user by removing the session cookie.
 */
async function signOut(): Promise<void> {
    try {
        await APIClient.post(Endpoint.SIGN_OUT);
        return;
    } catch (e) {
        throw e;
    }
}

const AuthAPI = {
    getCurrentUser,
    getUserById,
    signInWithGoogle,
    signOut
};


export default AuthAPI;