import getCollection, {POSTS_COLLECTION} from "@/db";

export async function POST(request: Request) {
    try {
        const {url, alias} = await request.json();
        if (!url || !alias) {
            return Response.json({ error: "Missing URL or alias"}, {status: 400});
        }
        try {
            const pattern = new URL(url);
            const urlPatterns = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const urlname = pattern.hostname;
            if (!urlPatterns.test(urlname)) {
                return Response.json({error: "Invalid URL format"}, {status: 400});   
            }
            
            try {
                const result = await fetch(url, {method: "HEAD", redirect: "follow"});
                if (!result.ok) {
                    return Response.json({error: "Server Error"}, {status: 400});
                }
            } catch {
                return Response.json({error: "Invalid URL format"}, {status: 400});
            }
        } catch {
            return Response.json({error: "Invalid URL format"}, {status: 400});
        }
        
        const urlCollection = await getCollection(POSTS_COLLECTION);
        
        const data = await urlCollection.findOne({alias});
        if (data) {
            return Response.json({error:"Invalid alias: This alias already exists"}, {status: 400});
        }
        await urlCollection.insertOne({alias, url});
        return Response.json({message: "Shorten URL created!"});

    } catch (err: unknown) {
        let message = "Unknown error";
            if (err instanceof Error) {
                message = err.message;
            }
        return Response.json({error: message});
    }
}