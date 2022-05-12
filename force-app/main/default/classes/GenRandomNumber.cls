/**********************************
@author: Shams
@date: 07/08/2020
@purpose: Random Number generator
***********************************/
public class GenRandomNumber {
    
    @InvocableMethod(label='Random Number Gen')
    public static List<String> GenRN(List<Integer> length){
        String rand = string.valueof(Math.abs(Crypto.getRandomInteger()));
        List<String> OTP=new List<String>();
        OTP.add(rand.substring(0,length[0])); 
        return OTP;
    }
}