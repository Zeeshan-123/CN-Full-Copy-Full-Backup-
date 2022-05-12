/*-------------------------------------------------------------------------------------------------
Author:             Zeeshan Haider
Date:               03-Aug-2021
Version:            1.0
Description:        This class is used as controller for Attachment Trigger.
----------------------------------------------------------------------------------------------------*/

public without sharing class AttachmentTrgHandler {
    
    public void onAfterInsert(List<Attachment> newObjects, Map<Id, Attachment> newMap)
    {
        CreateContentVersionAndDeleteAttachment(newObjects,newMap);
    }
    
    private void CreateContentVersionAndDeleteAttachment(List<Attachment> ListOfAttachments,Map<Id,Attachment> MapOfAttachments)
    {
        Set<Id> SetOfAttachmentIds = new Set<Id>(); // List of Attachment be 
        List<ContentVersion> ListOfContVersion = new List<ContentVersion>();
        for(Attachment attach : ListOfAttachments)
        {
            //Insert ContentVersion
            ContentVersion cVersion = new ContentVersion();
            cVersion.ContentLocation = 'S'; //S-Document is in Salesforce. E-Document is outside of Salesforce. L-Document is on a Social Netork.
            cVersion.PathOnClient = attach.Name;//File name with extention
            cVersion.Origin = 'C';//C-Content Origin. H-Chatter Origin.
            cVersion.OwnerId = attach.OwnerId;//Owner of the file
            cVersion.Title = attach.Name;//Name of the file
            cVersion.VersionData = attach.Body; //File content
            cVersion.FirstPublishLocationId = attach.ParentId;
            ListOfContVersion.add(cVersion);
            SetOfAttachmentIds.add(attach.Id);
        }
        
        if(ListOfContVersion.size() > 0)
        {
            insert ListOfContVersion;
        }
        if(SetOfAttachmentIds.size() > 0 && SetOfAttachmentIds != Null){
            //Delete Attachments
            DeleteAttacments(SetOfAttachmentIds);
        }
    }
    
    //method for Delete Attacments
    @future 
    public static void DeleteAttacments(Set<Id> SetOfAttachmentIds)
    {
        List<Attachment> ListOfAttachmnets = [Select Id from Attachment where Id IN :SetOfAttachmentIds];
        if(SetOfAttachmentIds != Null && SetOfAttachmentIds.size() > 0){
            delete ListOfAttachmnets;
        }
    }
}