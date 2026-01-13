export default interface ProcessReturnDto{
    transaction_code: string;
    returned_by_user_id: number;
    items: {
        batch_code: string;
        status: string;
    }[];
    // ngay thu hoi tai san
    return_date: string;
}