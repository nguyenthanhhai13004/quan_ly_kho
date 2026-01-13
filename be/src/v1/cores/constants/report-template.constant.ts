export const ReportTemplates = {
  INVENTORY: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Báo cáo tồn kho</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12pt; }
      .title {
        font-size: 20pt;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        color: #0b5394;
      }
      .report-info {
        font-size: 12pt;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed;
      }

      th, td {
        border: 1px solid #000;
        padding: 6px 8px;
        vertical-align: top;
        word-wrap: break-word;
      }

      th {
        background-color: #f2f2f2;
        text-align: center;
      }

      .col-category { width: 20%; max-width: 200px; }
      .col-assets { width: 80%; }

      .category-row {
        font-weight: bold;
      }

      .allocation-table {
        border-collapse: collapse;
        width: 100%;
        font-weight: normal;
      }

      .allocation-table th, .allocation-table td {
        border: 1px solid #666;
        padding: 4px 6px;
        font-size: 8pt;
        text-align: left;
      }

      .allocation-table th {
        background-color: #f9f9f9;
      }

      tr:nth-child(even) { background-color: #f9f9f9; }
      tr:hover { background-color: #ffe599; }

      td.number { text-align: right; }
      td.date { text-align: center; }
      .total-row {
        background-color: #c9daf8;
        font-weight: bold;
        text-align: right;
      }
      .total-label {
        text-align: left;
        font-weight: bold;
      }
    </style>
  </head>

  <body>
    <div class="title">BÁO CÁO TỒN KHO</div>

    <div class="report-info">
      <div>Kho: {{WAREHOUSE_NAME}}</div>
      <div>Ngày xuất: {{REPORT_DATE}}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="col-category">Danh mục</th>
          <th class="col-assets">Thông tin tài sản</th>
        </tr>
      </thead>
      <tbody>
        <!-- CATEGORY_LOOP_START -->
        <tr class="category-row">
          <td>{{CATEGORY_NAME}}</td>
          <td>
            <table class="allocation-table">
              <thead>
                <tr>
                  <th>Tên tài sản</th>
                  <th>Mã tài sản</th>
                  <th>Mã lô</th>
                  <th>Số lượng</th>
                  <th>Trạng thái</th>
                  <th>Hạn sử dụng</th>
                  <th>Bảo trì</th>
                </tr>
              </thead>
              <tbody>
                <!-- ASSET_LOOP_START -->
                <tr>
                  <td>{{ASSET_NAME}}</td>
                  <td>{{ASSET_CODE}}</td>
                  <td colspan="5">
                    <table class="allocation-table">
                      <!-- BATCH_LOOP_START -->
                      <tr>
                        <td>{{BATCH_CODE}}</td>
                        <td class="number">{{BATCH_QUANTITY}}</td>
                        <td>{{BATCH_STATUS}}</td>
                        <td class="date">{{BATCH_EXPIRATION}}</td>
                        <td class="date">{{BATCH_MAINTENANCE}}</td>
                      </tr>
                      <!-- BATCH_LOOP_END -->
                    </table>
                  </td>
                </tr>
                <!-- ASSET_LOOP_END -->
              </tbody>
            </table>
          </td>
        </tr>
        <!-- CATEGORY_LOOP_END -->
        <tr class="total-row">
          <td class="total-label">Tổng số lượng tài sản</td>
          <td class="number">{{TOTAL_QUANTITY}}</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
  ALLOCATION: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Báo cáo cấp phát</title>

    <style>
      body { font-family: Arial, sans-serif; font-size: 12pt; }
      .title {
        font-size: 20pt;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        color: #0b5394;
      }

      .report-info {
        font-size: 12pt;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }

      table {
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed; /* giúp điều chỉnh độ rộng cột */
      }

      th, td {
        border: 1px solid #000;
        padding: 6px 8px;
        vertical-align: top;
        word-wrap: break-word;
      }

      th {
        background-color: #f2f2f2;
        font-weight: bold;
        text-align: center;
      }

      /* Giới hạn độ rộng cho cột tên người và email */
      .col-user {
        width: 15%; 
        max-width: 150px;
        word-wrap: break-word;
      }

      .col-email {
        width: 20%;
        max-width: 200px;
        word-wrap: break-word;
      }

      .col-allocation {
        width: 65%; /* phần còn lại cho bảng con */
      }

      .allocation-table {
        border-collapse: collapse;
        width: 100%;
      }

      .allocation-table th, .allocation-table td {
        border: 1px solid #666;
        padding: 4px 6px;
        font-size: 8pt;
        text-align: left;
      }

      .allocation-table th {
        background-color: #f9f9f9;
      }

      tr:nth-child(even) { background-color: #f9f9f9; }
      tr:hover { background-color: #ffe599; }

    </style>
  </head>

  <body>
    <div class="title">BÁO CÁO CẤP PHÁT TÀI SẢN</div>

    <div class="report-info">
      <div>Kho: {{WAREHOUSE_NAME}}</div>
      <div>Ngày xuất: {{REPORT_DATE}}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="col-user">Tên người / Đơn vị</th>
          <th class="col-email">Email</th>
          <th class="col-allocation">Thông tin cấp phát</th>
        </tr>
      </thead>

      <tbody>
        <!-- USERS_LOOP_START -->
        <tr>
          <td class="col-user">{{USER_FULLNAME}}</td>
          <td class="col-email">{{USER_EMAIL}}</td>
          <td class="col-allocation">
            <table class="allocation-table">
              <thead>
                <tr>
                  <th>Tên tài sản</th>
                  <th>Mã tài sản</th>
                  <th>Ngày cấp</th>
                  <th>Hạn thu hồi</th>
                  <th>Mã lô</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                <!-- ASSETS_LOOP_START -->
                <tr>
                  <td>{{ASSET_NAME}}</td>
                  <td>{{ASSET_CODE}}</td>
                  <td>{{ALLOCATION_DATE}}</td>
                  <td>{{RETURN_DEADLINE}}</td>
                  <td colspan="2">
                    <table class="allocation-table">
                      <!-- BATCH_LOOP_START -->
                      <tr>
                        <td>{{BATCH_CODE}}</td>
                        <td>{{BATCH_QUANTITY}}</td>
                      </tr>
                      <!-- BATCH_LOOP_END -->
                    </table>
                  </td>
                </tr>
                <!-- ASSETS_LOOP_END -->
              </tbody>
            </table>
          </td>
        </tr>
        <!-- USERS_LOOP_END -->
      </tbody>
    </table>

  </body>
</html>
  `,
  DISPOSAL: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Báo cáo thanh lý</title>
  <style>
.disposal-title {
  font-size: 18pt;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  color: #0b5394;
}

.disposal-report-info {
  font-size: 11pt;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
}

table.disposal-main-table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
  font-size: 11px;
}

th {
  padding-bottom:5px
}

table.disposal-main-table th, table.disposal-main-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  vertical-align: top;
  word-wrap: break-word;
}

table.disposal-main-table th {
  background-color: #f2f2f2;
  text-align: center;
  font-weight: bold;
}

th.disposal-col-transaction, td.disposal-col-transaction { width: 10%; max-width: 120px; }
th.disposal-col-reason, td.disposal-col-reason { width: 20%; max-width: 180px;font-weight: normal; }
th.disposal-col-assets, td.disposal-col-assets { width: 70%; }

.disposal-asset-row { font-weight: normal; }

table.disposal-nested-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 9px;
}

table.disposal-nested-table th, table.disposal-nested-table td {
  border: 1px solid #666;
  padding: 2px 4px;
  font-size: 10px;
}

table.disposal-nested-table th { background-color: #f9f9f9; }

td.disposal-number { text-align: right; width: 15%; }
td.disposal-status { text-align: center; width: 15%; }
td.disposal-value { width: 35%; }

.disposal-total-row {
  background-color: #c9daf8;
  font-weight: bold;
  text-align: right;
  font-size: 11pt;
  padding: 6px;
}
td.disposal-asset-name { width: 15%;}
td.disposal-asset-code { width: 15%; }
td.disposal-asset-category { width: 15%; }
td.disposal-asset-batches { width: 65%; }
 tr:nth-child(even) { background-color: #f9f9f9; }
tr:hover { background-color: #ffe599; }
  </style>
</head>

<body>
  <div class="disposal-title">BÁO CÁO THANH LÝ TÀI SẢN</div>

  <div class="disposal-report-info">
    <div>Kho: {{WAREHOUSE_NAME}}</div>
    <div>Ngày xuất báo cáo: {{REPORT_DATE}}</div>
  </div>

  <table class="disposal-main-table">
    <thead>
      <tr>
        <th class="disposal-col-transaction">Mã đơn hàng</th>
        <th class="disposal-col-reason">Lý do thanh lý</th>
        <th class="disposal-col-assets">Danh sách tài sản</th>
      </tr>
    </thead>

    <tbody>
      <!-- CATEGORY_LOOP_START -->
      <tr class="disposal-transaction-row">
        <td>{{TRANSACTION_CODE}}</td>
        <td>{{REASON}}</td>
        <td>
          <table class="disposal-nested-table">
            <thead>
              <tr>
                <th>Tên tài sản</th>
                <th>Mã tài sản</th>
                <th>Danh mục</th>
                <th>Danh sách lô</th>
              </tr>
            </thead>
            <tbody>
              <!-- ASSET_LOOP_START -->
              <tr class="disposal-asset-row">
                <td class="disposal-asset-name">{{ASSET_NAME}}</td>
  <td class="disposal-asset-code">{{ASSET_CODE}}</td>
  <td class="disposal-asset-category">{{CATEGORY_NAME}}</td>
                <td class="disposal-asset-batches">
                  <table class="disposal-nested-table">
                    <thead>
                      <tr>
                        <th class="disposal-value">Giá trị ban đầu</th>
                        <th class="disposal-value">Giá trị thanh lý</th>
                        <th class="disposal-number">Số lượng</th>
                        <th class="disposal-status">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- BATCH_LOOP_START -->
                      <tr>
                        <td class="disposal-number">{{ORIGINAL_VALUE}}</td>
                        <td class="disposal-number">{{DISPOSAL_VALUE}}</td>
                        <td class="disposal-number">{{BATCH_QUANTITY}}</td>
                        <td class="disposal-status">{{BATCH_STATUS}}</td>
                      </tr>
                      <!-- BATCH_LOOP_END -->
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- ASSET_LOOP_END -->
            </tbody>
          </table>
        </td>
      </tr>
      <!-- CATEGORY_LOOP_END -->
    </tbody>
  </table>

  <div class="disposal-total-row">
    Tổng suy giảm giá trị: {{TOTAL_DEPRECIATION}}
  </div>
</body>
</html>

`,
  MAINTENANCE: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Báo cáo bảo trì</title>

  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; }

    .title {
      font-size: 20pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
      color: #0b5394;
    }

    .report-info {
      font-size: 12pt;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      table-layout: fixed;
    }

    th, td {
      border: 1px solid #000;
      padding: 6px 8px;
      word-wrap: break-word;
      vertical-align: middle;
    }

    th {
      background-color: #f2f2f2;
      text-align: center;
      font-weight: bold;
    }

    tr.maint-row:nth-child(even) { background-color: #f9f9f9; }
    tr.maint-row:hover { background-color: #ffe599; }

    .total-row {
      background-color: #c9daf8;
      font-weight: bold;
      font-size: 13pt;
      text-align: right;
    }

    .multi-info {
      line-height: 1.4em;
    }
  </style>
</head>

<body>
  <div class="title">BÁO CÁO LỊCH BẢO TRÌ THEO QUÝ / NĂM</div>

  <div class="report-info">
    <div>Kho: {{warehouse_name}}</div>
    <div>Quý {{quarter}} / Năm {{year}}</div>
  </div>

  <!-- TABLE_START -->
  <table>
    <thead>
      <tr>
        <th>Mã đơn hàng</th>
        <th>Ngày đơn hàng</th>
        <th>Thông tin bảo trì (Mã lô / Mã tài sản / Tên tài sản / Chi phí / Kết quả)</th>
      </tr>
    </thead>

    <tbody>
      <!-- MAINT_START -->
      <tr class="maint-row">
        <td>{{transaction_code}}</td>
        <td>{{date}}</td>
        <td class="multi-info">{{details}}</td>
      </tr>
      <!-- MAINT_END -->
    </tbody>

    <tfoot>
      <tr class="total-row">
        <td>Tổng chi phí bảo trì</td>
        <td></td>
        <td>{{total_cost}}</td>
      </tr>
    </tfoot>
  </table>
  <!-- TABLE_END -->

</body>
</html>

`,
};
