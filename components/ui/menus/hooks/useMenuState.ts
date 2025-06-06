// Menu state management hook
import { useState, useEffect } from 'react';
import { MenuId } from '../utils/menuOptions';
import { SettingsState, SettingsActions } from '../utils/settingsHandlers';
import { useAudioVolumeContext } from '../../../../context/audioVolumeContext';

export interface MenuState {
	selectedOption: string;
	menuVisible: boolean;
	logoAnimated: boolean;
	currentMenu: MenuId;
	menuTransitioning: boolean;
	showComingSoon: boolean;
	comingSoonMessage: string;
	parallaxOffset: { x: number; y: number };
}

export interface MenuActions {
	setSelectedOption: (option: string) => void;
	setMenuVisible: (visible: boolean) => void;
	setLogoAnimated: (animated: boolean) => void;
	setCurrentMenu: (menu: MenuId) => void;
	setMenuTransitioning: (transitioning: boolean) => void;
	setShowComingSoon: (show: boolean) => void;
	setComingSoonMessage: (message: string) => void;
	setParallaxOffset: (offset: { x: number; y: number }) => void;
}

export const useMenuState = () => {
	// Get global audio context
	const audioContext = useAudioVolumeContext();

	// Menu state
	const [selectedOption, setSelectedOption] = useState<string>('singleplayer');
	const [menuVisible, setMenuVisible] = useState<boolean>(true);
	const [logoAnimated, setLogoAnimated] = useState<boolean>(false);
	const [currentMenu, setCurrentMenu] = useState<MenuId>('main');
	const [menuTransitioning, setMenuTransitioning] = useState<boolean>(false);
	const [showComingSoon, setShowComingSoon] = useState<boolean>(false);
	const [comingSoonMessage, setComingSoonMessage] = useState<string>('');
	const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

	// Non-audio settings state (keep local)
	const [antiAliasing, setAntiAliasing] = useState<string>('Off');
	const [shadowQuality, setShadowQuality] = useState<string>('High');
	const [textureQuality, setTextureQuality] = useState<string>('High');
	const [effectsQuality, setEffectsQuality] = useState<string>('High');
	const [audioQuality, setAudioQuality] = useState<string>('High');
	const [mouseSensitivity, setMouseSensitivity] = useState<number>(5);
	const [reverseMouse, setReverseMouse] = useState<boolean>(false);

	// Initialize logo animation
	useEffect(() => {
		setTimeout(() => {
			setLogoAnimated(true);
		}, 500);
	}, []);

	// Show coming soon notification
	const showComingSoonNotification = (message: string) => {
		setComingSoonMessage(message);
		setShowComingSoon(true);

		setTimeout(() => {
			setShowComingSoon(false);
		}, 3000);
	};

	// Handle music volume changes from audio player
	const handleMusicVolumeChange = (volume: number) => {
		const musicOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
		const closestOption = musicOptions.reduce((prev, curr) => {
			return Math.abs(curr - volume) < Math.abs(prev - volume) ? curr : prev;
		});

		if (closestOption !== audioContext.musicVolume) {
			audioContext.setMusicVolume(closestOption);
		}
	};

	// Return state and actions
	const menuState: MenuState = {
		selectedOption,
		menuVisible,
		logoAnimated,
		currentMenu,
		menuTransitioning,
		showComingSoon,
		comingSoonMessage,
		parallaxOffset,
	};

	const menuActions: MenuActions = {
		setSelectedOption,
		setMenuVisible,
		setLogoAnimated,
		setCurrentMenu,
		setMenuTransitioning,
		setShowComingSoon,
		setComingSoonMessage,
		setParallaxOffset,
	};

	const settingsState: SettingsState = {
		antiAliasing,
		shadowQuality,
		textureQuality,
		effectsQuality,
		masterVolume: audioContext.masterVolume,
		musicVolume: audioContext.musicVolume,
		sfxVolume: audioContext.sfxVolume,
		voiceVolume: audioContext.voiceVolume,
		audioQuality,
		mouseSensitivity,
		reverseMouse,
		showAudioPlayer: audioContext.showAudioPlayer,
	};

	const settingsActions: SettingsActions = {
		setAntiAliasing,
		setShadowQuality,
		setTextureQuality,
		setEffectsQuality,
		setMasterVolume: audioContext.setMasterVolume,
		setMusicVolume: audioContext.setMusicVolume,
		setSfxVolume: audioContext.setSfxVolume,
		setVoiceVolume: audioContext.setVoiceVolume,
		setAudioQuality,
		setMouseSensitivity,
		setReverseMouse,
		setShowAudioPlayer: audioContext.setShowAudioPlayer,
	};

	return {
		menuState,
		menuActions,
		settingsState,
		settingsActions,
		showComingSoonNotification,
		handleMusicVolumeChange,
	};
};
