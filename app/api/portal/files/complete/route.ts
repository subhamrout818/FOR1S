import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { r2Request } from "@/lib/r2-storage";
import { isAllowedImageMetadata, matchesImageSignature, MAX_IMAGE_BYTES } from "@/lib/r2-upload-validation";
export const runtime = "nodejs";
export async function POST(req: Request) {
 const user = await requireAuth(req);
 if (!user) return NextResponse.json({ success:false, message:"Unauthorized" }, {status:401});
 try {
  const body = await req.json();
  const projectId = typeof body.projectId === "string" ? body.projectId : "";
  const folderId = typeof body.folderId === "string" ? body.folderId : "";
  const name = typeof body.name === "string" ? body.name : "";
  const mimeType = typeof body.mimeType === "string" ? body.mimeType.toLowerCase() : "";
  const size = Number(body.size);
  const key = typeof body.objectKey === "string" ? body.objectKey : "";
  if (!projectId || !folderId || !key.startsWith(`clients/${user.id}/${projectId}/`) || !isAllowedImageMetadata(name,mimeType,size)) return NextResponse.json({success:false,message:"Invalid upload details"},{status:400});
  const folder = await prisma.folder.findFirst({where:{id:folderId,projectId,project:{clientId:user.id}},select:{id:true,projectId:true}});
  if (!folder) return NextResponse.json({success:false,message:"Folder not found"},{status:404});
  const head = await r2Request("HEAD",key);
  const storedSize = Number(head.headers.get("content-length"));
  if (!head.ok || !Number.isFinite(storedSize) || storedSize !== size || storedSize > MAX_IMAGE_BYTES) return NextResponse.json({success:false,message:"Uploaded image size could not be verified"},{status:400});
  const response = await r2Request("GET",key);
  if (!response.ok) return NextResponse.json({success:false,message:"Uploaded image could not be verified"},{status:400});
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength !== size || bytes.byteLength > MAX_IMAGE_BYTES || !matchesImageSignature(bytes,mimeType)) return NextResponse.json({success:false,message:"Image content or size is invalid"},{status:400});
  const file = await prisma.fileAsset.create({data:{projectId,folderId,name,url:`r2://${key}`,mimeType,size:bytes.byteLength,kind:"image",uploadedById:user.id},select:{id:true,name:true,size:true,mimeType:true,createdAt:true}});
  return NextResponse.json({success:true,file});
 } catch (error) { console.error("R2 upload completion error:",error); return NextResponse.json({success:false,message:"Unable to finish upload"},{status:500}); }
}