/**
 * android sign
 */

keytool -genkey -v -keystore XXXX.keystore -alias XXXX -keyalg RSA -validity 365

jarsigner -keystore XXXX.keystore -digestalg SHA1 -sigalg MD5withRSA XXXX-release-unsigned.apk XXXX
