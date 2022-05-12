/**********************************
@author: Shams
@date: 09/11/2020
@purpose: test class for SurveyInviteHandler
***********************************/
@istest
public class SurveyInviteHandlerTest {
    @istest(seealldata=true)
    public static void runtest(){
        List<SurveyInvitation> SI=[select name,id,ResponseStatus,ParticipantId from surveyinvitation where responsestatus='Completed' order by lastmodifieddate limit 1];
        Surveyinvitehandler.handleupdate(SI);
    }
}