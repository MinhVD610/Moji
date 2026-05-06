import { set } from 'zod';
import {create} from 'zustand';
import {toast} from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';


export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken) => {
        set({ accessToken });
    },

    clearState: () => {
        set({ accessToken: null, user: null, loading: false });
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            // gọi api
            await authService.signUp(username, password, email, firstName, lastName);
            toast.success('Sign up successful! Please log in.');
        } catch (error) {
            console.error('Sign up failed:', error);
            toast.error('Sign up failed. Please try again.');
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });

            const { accessToken } = await authService.signIn(username, password);
            get().setAccessToken(accessToken);

            await get().fetchMe();

            toast.success('Sign in successful!');
        } catch (error) {
            console.error('Sign in failed:', error);
            toast.error('Sign in failed. Please try again.');
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success('Sign out successful!');
        } catch (error) {
            console.error('Sign out failed:', error);
            toast.error('Sign out failed. Please try again.');  
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            console.error( error);
            set({ user: null, accessToken: null });
            toast.error('Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại.');
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({ loading: true });
            const { user, fetchMe, setAccessToken } = get();
            const accessToken = await authService.refresh();

            setAccessToken(accessToken);

            if (!user) {
                await fetchMe();
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            get().clearState();
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'); 
        } finally {
            set({loading: false}) 
        }

        },
}));
