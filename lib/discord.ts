export const sendToDiscord = async (webhookUrl: string, content: string) => {
    if (!webhookUrl) return false;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Discord Webhook Error:', error);
        return false;
    }
};
