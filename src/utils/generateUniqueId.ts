export default function generateUniqueId() {
    return Date.now() + Math.floor(Math.random() * 1000); // Example: 1700000123456
}